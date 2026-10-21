package server

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"zima-display/internal/config"
	"zima-display/internal/metrics"
	"zima-display/internal/player"
	"zima-display/internal/remote"
)

type fakeSourceService struct {
	secrets map[string]string
	status  []remote.Status
}

func (f *fakeSourceService) Statuses() []remote.Status              { return f.status }
func (f *fakeSourceService) Snapshots() map[string]metrics.Snapshot { return nil }
func (f *fakeSourceService) Probe(context.Context, config.RemoteSource, string) (remote.ProbeResult, error) {
	return remote.ProbeResult{HostKey: "SHA256:test"}, nil
}
func (f *fakeSourceService) SetSecret(id, password string) error {
	if f.secrets == nil {
		f.secrets = map[string]string{}
	}
	f.secrets[id] = password
	return nil
}
func (f *fakeSourceService) DeleteSecret(id string) error { delete(f.secrets, id); return nil }
func (f *fakeSourceService) Wake()                        {}

func TestWithin(t *testing.T) {
	if !within("/DATA", "/DATA/Media/movie.mp4") {
		t.Fatal("expected child path to be within root")
	}
	if within("/DATA", "/DATA-other/movie.mp4") {
		t.Fatal("prefix-only match escaped root")
	}
}

func TestResolveTargetAllowsSupportedNetworkMedia(t *testing.T) {
	cfg := config.Default()
	for _, target := range []string{"https://example.com/live.m3u8", "rtsp://camera.local/stream"} {
		resolved, err := resolveTarget(cfg, target)
		if err != nil || resolved != target {
			t.Fatalf("resolveTarget(%q) = %q, %v", target, resolved, err)
		}
	}
	if _, err := resolveTarget(cfg, "file:///etc/passwd"); err == nil {
		t.Fatal("expected file URL to be rejected")
	}
}

func TestMediaKind(t *testing.T) {
	if mediaKind("movie.MKV", false) != "video" || mediaKind("photo.webp", false) != "image" || mediaKind("notes.txt", false) != "" {
		t.Fatal("media type detection returned an unexpected result")
	}
}

func TestResolveSlideshowTargetsSortsImagesAndIgnoresOtherFiles(t *testing.T) {
	directory := t.TempDir()
	for name, data := range map[string]string{
		"10-last.JPG":   "image",
		"02-middle.png": "image",
		"01-first.webp": "image",
		"notes.txt":     "ignored",
	} {
		if err := os.WriteFile(filepath.Join(directory, name), []byte(data), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	cfg := config.Default()
	cfg.MediaRoots = []string{directory}
	got, err := resolveSlideshowTargets(cfg, directory)
	if err != nil {
		t.Fatal(err)
	}
	realDirectory, err := filepath.EvalSymlinks(directory)
	if err != nil {
		t.Fatal(err)
	}
	want := []string{
		filepath.Join(realDirectory, "01-first.webp"),
		filepath.Join(realDirectory, "02-middle.png"),
		filepath.Join(realDirectory, "10-last.JPG"),
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("slideshow targets = %#v, want %#v", got, want)
	}
}

func TestSlideshowDurationUsesConfiguredDefault(t *testing.T) {
	cfg := config.Default()
	cfg.Media.SlideshowIntervalSeconds = 15
	if got := slideshowDuration(cfg, 0); got != 15 {
		t.Fatalf("default slideshow duration = %v, want 15", got)
	}
	if got := slideshowDuration(cfg, 5); got != 5 {
		t.Fatalf("requested slideshow duration = %v, want 5", got)
	}
}

func TestHealthEndpoint(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, apiPrefix+"/health", nil)
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		t.Fatalf("health returned %d", recorder.Code)
	}
}

func TestLiveFrameEndpointReturnsCurrentRendererFrame(t *testing.T) {
	dataDirectory := t.TempDir()
	path := filepath.Join(dataDirectory, config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	runtimeDirectory, err := os.MkdirTemp("/tmp", "zd-live-frame-")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(runtimeDirectory) })
	socketPath := filepath.Join(runtimeDirectory, "mpv.sock")
	listener, err := net.Listen("unix", socketPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = listener.Close() })
	go func() {
		connection, acceptErr := listener.Accept()
		if acceptErr != nil {
			return
		}
		defer connection.Close()
		var request struct {
			Command   []any `json:"command"`
			RequestID int64 `json:"request_id"`
		}
		if json.NewDecoder(connection).Decode(&request) != nil {
			return
		}
		screenshotPath, _ := request.Command[1].(string)
		_ = os.WriteFile(screenshotPath, []byte{0xff, 0xd8, 0xff, 0xd9}, 0o600)
		_ = json.NewEncoder(connection).Encode(map[string]any{"error": "success", "request_id": request.RequestID})
	}()

	controller := player.New(socketPath, runtimeDirectory, store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, apiPrefix+"/preview/frame", nil)
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		t.Fatalf("live frame returned %d: %s", recorder.Code, recorder.Body.String())
	}
	if recorder.Header().Get("Content-Type") != "image/jpeg" || !bytes.Equal(recorder.Body.Bytes(), []byte{0xff, 0xd8, 0xff, 0xd9}) {
		t.Fatalf("unexpected live frame response: content-type=%q body=%v", recorder.Header().Get("Content-Type"), recorder.Body.Bytes())
	}
}

func TestMediaRootUsesLanguageNeutralUploadLabel(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, apiPrefix+"/media", nil)
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		t.Fatalf("media returned %d", recorder.Code)
	}
	var response mediaResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatal(err)
	}
	if len(response.Entries) == 0 || response.Entries[0].Label != "uploads" {
		t.Fatalf("upload root label = %#v, want uploads", response.Entries)
	}
}

func TestAutomationEndpointsRequireBearerToken(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	body := []byte(`{"title":"Demo","pages":["One"]}`)

	unauthorized := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, apiPrefix+"/v1/presentations/text", bytes.NewReader(body))
	api.Handler().ServeHTTP(unauthorized, request)
	if unauthorized.Code != http.StatusUnauthorized {
		t.Fatalf("unauthorized request returned %d", unauthorized.Code)
	}

	authorized := httptest.NewRecorder()
	request = httptest.NewRequest(http.MethodPost, apiPrefix+"/v1/presentations/text", bytes.NewReader(body))
	request.Header.Set("Authorization", "Bearer "+store.Get().Automation.Token)
	api.Handler().ServeHTTP(authorized, request)
	if authorized.Code != http.StatusCreated {
		t.Fatalf("authorized request returned %d: %s", authorized.Code, authorized.Body.String())
	}
}

func TestStatusDoesNotExposeAutomationToken(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, apiPrefix+"/status", nil)
	api.Handler().ServeHTTP(recorder, request)
	if bytes.Contains(recorder.Body.Bytes(), []byte(store.Get().Automation.Token)) {
		t.Fatal("status response exposed the automation token")
	}
}

func TestRemoteSourceAPIStoresSecretWithoutReturningIt(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	sources := &fakeSourceService{}
	api.SetSourceService(sources)
	body := []byte(`{"name":"NAS A","host":"10.0.0.20","port":22,"user":"casaos","password":"top-secret","poll_interval_seconds":5}`)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, apiPrefix+"/sources", bytes.NewReader(body))
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusCreated {
		t.Fatalf("create source returned %d: %s", recorder.Code, recorder.Body.String())
	}
	if bytes.Contains(recorder.Body.Bytes(), []byte("top-secret")) {
		t.Fatal("create source response exposed the SSH password")
	}
	if len(store.Get().Sources) != 1 || store.Get().Sources[0].HostKey != "SHA256:test" {
		t.Fatalf("source was not saved with pinned host key: %#v", store.Get().Sources)
	}
	id := store.Get().Sources[0].ID
	if sources.secrets[id] != "top-secret" {
		t.Fatal("SSH password was not stored in the secret service")
	}

	statusRecorder := httptest.NewRecorder()
	api.Handler().ServeHTTP(statusRecorder, httptest.NewRequest(http.MethodGet, apiPrefix+"/status", nil))
	if bytes.Contains(statusRecorder.Body.Bytes(), []byte("top-secret")) {
		t.Fatal("status response exposed the SSH password")
	}

	deleteRecorder := httptest.NewRecorder()
	api.Handler().ServeHTTP(deleteRecorder, httptest.NewRequest(http.MethodDelete, apiPrefix+"/sources/"+id, nil))
	if deleteRecorder.Code != http.StatusOK || len(store.Get().Sources) != 0 || sources.secrets[id] != "" {
		t.Fatalf("source delete failed: status=%d sources=%#v secrets=%#v", deleteRecorder.Code, store.Get().Sources, sources.secrets)
	}
}

func TestConfigurationEndpointSavesRendererSettingsAndPreservesToken(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	originalToken := store.Get().Automation.Token
	cfg := store.Get()
	cfg.Renderer.Backend = "wayland"
	cfg.Renderer.Resolution = "1920x1080"
	cfg.Renderer.AudioDevice = "alsa/hdmi"
	cfg.DefaultMode = "clock"
	cfg.Automation.Token = ""
	body, err := json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPut, apiPrefix+"/config", bytes.NewReader(body))
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		t.Fatalf("configuration returned %d: %s", recorder.Code, recorder.Body.String())
	}
	saved := store.Get()
	if saved.Renderer.Backend != "wayland" || saved.Renderer.Resolution != "1920x1080" || saved.Renderer.AudioDevice != "alsa/hdmi" || saved.DefaultMode != "clock" {
		t.Fatalf("renderer settings were not saved: %#v", saved)
	}
	if saved.Automation.Token != originalToken {
		t.Fatal("configuration update replaced the stored automation token")
	}
}

func TestConfigurationEndpointRejectsUnsafeMediaRootWithoutChangingStore(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	cfg := store.Get()
	cfg.MediaRoots = []string{"/etc"}
	body, err := json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPut, apiPrefix+"/config", bytes.NewReader(body))
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("unsafe configuration returned %d, want 400", recorder.Code)
	}
	if !reflect.DeepEqual(store.Get().MediaRoots, []string{"/DATA"}) {
		t.Fatalf("invalid update changed stored media roots: %#v", store.Get().MediaRoots)
	}
}

func TestDashboardPreviewUsesDraftAppearance(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	body := []byte(`{"dashboard":{"title":"Preview","language":"en-US","layout":"large","font_scale":1.5,"refresh_interval_ms":1000},"resolution":"1024x600"}`)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, apiPrefix+"/preview/dashboard", bytes.NewReader(body))
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		t.Fatalf("preview returned %d: %s", recorder.Code, recorder.Body.String())
	}
	var scene player.Scene
	if err := json.Unmarshal(recorder.Body.Bytes(), &scene); err != nil {
		t.Fatal(err)
	}
	if scene.Width != 1920 || scene.Height != 1080 || len(scene.Elements) == 0 {
		t.Fatalf("unexpected preview scene: %#v", scene)
	}
	foundTitle := false
	for _, element := range scene.Elements {
		if element.ID == "title" && element.Text == "PREVIEW" {
			foundTitle = true
		}
	}
	if !foundTitle {
		t.Fatal("preview scene did not use draft dashboard settings")
	}
}

func TestCanvasPreviewUsesDraftLayout(t *testing.T) {
	path := filepath.Join(t.TempDir(), config.ConfigName)
	store, err := config.NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	controller := player.New(filepath.Join(t.TempDir(), "mpv.sock"), t.TempDir(), store.Get)
	api := New(log.New(io.Discard, "", 0), store, controller, "test-version")
	canvas := store.Get().Canvas
	canvas.Widgets = []config.CanvasWidget{{ID: "message", Type: "text", Text: "Hello Canvas", X: 100, Y: 120, Width: 800, Height: 100, FontSize: 64, Color: "#ffffff", Bold: true}}
	payload, err := json.Marshal(canvasPreviewRequest{Canvas: canvas})
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, apiPrefix+"/preview/canvas", bytes.NewReader(payload))
	api.Handler().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		t.Fatalf("canvas preview returned %d: %s", recorder.Code, recorder.Body.String())
	}
	var scene player.Scene
	if err := json.Unmarshal(recorder.Body.Bytes(), &scene); err != nil {
		t.Fatal(err)
	}
	found := false
	for _, element := range scene.Elements {
		if element.WidgetID == "message" && element.Text == "Hello Canvas" {
			found = true
		}
	}
	if !found {
		t.Fatal("canvas preview did not render the draft widget")
	}
}
