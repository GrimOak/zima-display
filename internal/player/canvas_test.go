package player

import (
	"testing"
	"time"

	"zima-display/internal/config"
	"zima-display/internal/metrics"
)

func TestCanvasSceneUsesSelectedRemoteSource(t *testing.T) {
	cfg := config.Default()
	cfg.Sources = []config.RemoteSource{{ID: "nas-a", Name: "NAS A", Host: "10.0.0.20", Port: 22, User: "casaos", PollIntervalSeconds: 5}}
	cfg.Canvas.Widgets = []config.CanvasWidget{{ID: "remote-cpu", Type: "cpu", SourceID: "nas-a", X: 0, Y: 0, Width: 400, Height: 100, FontSize: 48, Color: "#ffffff"}}
	local := metrics.Snapshot{CPUPercent: 10}
	remote := map[string]metrics.Snapshot{"nas-a": {CPUPercent: 72}}
	scene := CanvasSceneWithSources(local, remote, cfg, time.Unix(0, 0))
	if len(scene.Elements) != 33 || scene.Elements[len(scene.Elements)-1].Text != "CPU 72%" {
		t.Fatalf("remote canvas widget = %#v", scene.Elements[len(scene.Elements)-1])
	}
}

func TestCanvasSceneMarksMissingRemoteSourceOffline(t *testing.T) {
	cfg := config.Default()
	cfg.Dashboard.Language = "zh-CN"
	cfg.Sources = []config.RemoteSource{{ID: "nas-a", Name: "NAS A", Host: "10.0.0.20", Port: 22, User: "casaos", PollIntervalSeconds: 5}}
	cfg.Canvas.Widgets = []config.CanvasWidget{{ID: "remote-memory", Type: "memory", SourceID: "nas-a", X: 0, Y: 0, Width: 400, Height: 100, FontSize: 48, Color: "#ffffff"}}
	scene := CanvasSceneWithSources(metrics.Snapshot{}, nil, cfg, time.Unix(0, 0))
	if got := scene.Elements[len(scene.Elements)-1].Text; got != "设备离线" {
		t.Fatalf("offline widget text = %q", got)
	}
}
