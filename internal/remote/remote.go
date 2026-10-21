package remote

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/crypto/ssh"

	"zima-display/internal/config"
	"zima-display/internal/metrics"
)

const SecretsName = "source-secrets.json"

type SecretStore struct {
	mu       sync.RWMutex
	path     string
	password map[string]string
}

func NewSecretStore(dataDir string) (*SecretStore, error) {
	store := &SecretStore{path: filepath.Join(dataDir, SecretsName), password: map[string]string{}}
	data, err := os.ReadFile(store.path)
	if err != nil && !errors.Is(err, os.ErrNotExist) {
		return nil, err
	}
	if len(data) > 0 {
		if err := json.Unmarshal(data, &store.password); err != nil {
			return nil, fmt.Errorf("decode remote source secrets: %w", err)
		}
	}
	if err == nil {
		if chmodErr := os.Chmod(store.path, 0o600); chmodErr != nil {
			return nil, chmodErr
		}
	}
	return store, nil
}

func (s *SecretStore) Password(id string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.password[id]
}

func (s *SecretStore) Set(id, password string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if strings.TrimSpace(password) == "" {
		return errors.New("SSH password cannot be empty")
	}
	s.password[id] = password
	return s.saveLocked()
}

func (s *SecretStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.password, id)
	return s.saveLocked()
}

func (s *SecretStore) saveLocked() error {
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(s.password, "", "  ")
	if err != nil {
		return err
	}
	tmp := s.path + ".tmp"
	if err := os.WriteFile(tmp, append(data, '\n'), 0o600); err != nil {
		return err
	}
	if err := os.Chmod(tmp, 0o600); err != nil {
		return err
	}
	return os.Rename(tmp, s.path)
}

type Status struct {
	ID       string           `json:"id"`
	Name     string           `json:"name"`
	Host     string           `json:"host"`
	Online   bool             `json:"online"`
	LastSeen time.Time        `json:"last_seen,omitempty"`
	Error    string           `json:"error,omitempty"`
	Metrics  metrics.Snapshot `json:"metrics"`
}

type ProbeResult struct {
	HostKey string
	Sample  rawSample
}

type sourceState struct {
	status   Status
	previous rawSample
	nextPoll time.Time
	polling  bool
	failures int
}

type Manager struct {
	mu      sync.RWMutex
	config  func() config.Config
	secrets *SecretStore
	states  map[string]*sourceState
	wake    chan struct{}
}

func NewManager(provider func() config.Config, secrets *SecretStore) *Manager {
	return &Manager{config: provider, secrets: secrets, states: map[string]*sourceState{}, wake: make(chan struct{}, 1)}
}

func (m *Manager) Run(ctx context.Context) {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		m.schedule(ctx)
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		case <-m.wake:
		}
	}
}

func (m *Manager) Wake() {
	select {
	case m.wake <- struct{}{}:
	default:
	}
}

func (m *Manager) Probe(ctx context.Context, source config.RemoteSource, password string) (ProbeResult, error) {
	return collect(ctx, source, password)
}

func (m *Manager) SetSecret(id, password string) error { return m.secrets.Set(id, password) }
func (m *Manager) DeleteSecret(id string) error        { return m.secrets.Delete(id) }

func (m *Manager) schedule(ctx context.Context) {
	now := time.Now()
	cfg := m.config()
	configured := make(map[string]config.RemoteSource, len(cfg.Sources))
	for _, source := range cfg.Sources {
		configured[source.ID] = source
		m.mu.Lock()
		state := m.states[source.ID]
		if state == nil {
			state = &sourceState{status: Status{ID: source.ID, Name: source.Name, Host: source.Host}}
			m.states[source.ID] = state
		}
		state.status.Name = source.Name
		state.status.Host = source.Host
		if !state.polling && !now.Before(state.nextPoll) {
			state.polling = true
			go m.poll(ctx, source)
		}
		m.mu.Unlock()
	}
	m.mu.Lock()
	for id := range m.states {
		if _, exists := configured[id]; !exists {
			delete(m.states, id)
		}
	}
	m.mu.Unlock()
}

func (m *Manager) poll(parent context.Context, source config.RemoteSource) {
	ctx, cancel := context.WithTimeout(parent, 6*time.Second)
	defer cancel()
	result, err := collect(ctx, source, m.secrets.Password(source.ID))
	now := time.Now()
	m.mu.Lock()
	defer m.mu.Unlock()
	state := m.states[source.ID]
	if state == nil {
		return
	}
	state.polling = false
	interval := time.Duration(source.PollIntervalSeconds) * time.Second
	if interval <= 0 {
		interval = 5 * time.Second
	}
	if err != nil {
		state.failures++
		state.status.Online = false
		state.status.Error = err.Error()
		backoff := interval * time.Duration(1<<min(state.failures-1, 4))
		if backoff > time.Minute {
			backoff = time.Minute
		}
		state.nextPoll = now.Add(backoff)
		return
	}
	state.failures = 0
	state.status.Online = true
	state.status.Error = ""
	state.status.LastSeen = now
	state.status.Metrics = snapshotFrom(result.Sample, state.previous, now)
	state.previous = result.Sample
	state.nextPoll = now.Add(interval)
}

func (m *Manager) Statuses() []Status {
	cfg := m.config()
	m.mu.RLock()
	defer m.mu.RUnlock()
	statuses := make([]Status, 0, len(cfg.Sources))
	for _, source := range cfg.Sources {
		if state := m.states[source.ID]; state != nil {
			statuses = append(statuses, state.status)
		} else {
			statuses = append(statuses, Status{ID: source.ID, Name: source.Name, Host: source.Host})
		}
	}
	return statuses
}

func (m *Manager) Snapshots() map[string]metrics.Snapshot {
	m.mu.RLock()
	defer m.mu.RUnlock()
	result := make(map[string]metrics.Snapshot)
	for id, state := range m.states {
		if state.status.Online {
			result[id] = state.status.Metrics
		}
	}
	return result
}

type rawSample struct {
	hostname, os, kernel string
	cpuTotal, cpuIdle    uint64
	memoryTotal          uint64
	memoryAvailable      uint64
	diskTotal, diskUsed  uint64
	networkRX, networkTX uint64
	uptime, temperature  float64
	ipAddresses          []string
	at                   time.Time
}

const sampleCommand = `LC_ALL=C sh -c '
printf "HOSTNAME="; cat /proc/sys/kernel/hostname 2>/dev/null || hostname
printf "CPU="; sed -n "1p" /proc/stat
awk "/^MemTotal:/ {print \"MEMTOTAL_KB=\" \$2} /^MemAvailable:/ {print \"MEMAVAILABLE_KB=\" \$2}" /proc/meminfo
disk_path=/; [ -d /DATA ] && disk_path=/DATA
df -B1 "$disk_path" 2>/dev/null | awk "NR==2 {print \"DISK=\" \$2 \" \" \$3}"
awk "{print \"UPTIME=\" \$1}" /proc/uptime
awk -F"[: ]+" "NR>2 && \$1 != \"lo\" {rx+=\$3; tx+=\$11} END {print \"NET=\" rx \" \" tx}" /proc/net/dev
ips=$(hostname -I 2>/dev/null || ip -o -4 addr show scope global 2>/dev/null | awk "{print \$4}" | cut -d/ -f1 | tr "\n" " "); printf "IP=%s\n" "$ips"
for f in /sys/class/thermal/thermal_zone*/temp; do if [ -r "$f" ]; then printf "TEMP_MILLI="; cat "$f"; break; fi; done
printf "KERNEL="; uname -r
if [ -r /etc/os-release ]; then . /etc/os-release; printf "OS=%s\n" "${PRETTY_NAME:-Linux}"; else echo "OS=Linux"; fi
'`

func collect(ctx context.Context, source config.RemoteSource, password string) (ProbeResult, error) {
	if password == "" {
		return ProbeResult{}, errors.New("SSH password is not configured")
	}
	var fingerprint string
	sshConfig := &ssh.ClientConfig{
		User: source.User,
		Auth: []ssh.AuthMethod{ssh.Password(password)},
		HostKeyCallback: func(_ string, _ net.Addr, key ssh.PublicKey) error {
			fingerprint = ssh.FingerprintSHA256(key)
			return verifyHostKey(source.HostKey, fingerprint)
		},
		Timeout: 5 * time.Second,
	}
	address := net.JoinHostPort(source.Host, strconv.Itoa(source.Port))
	dialer := net.Dialer{Timeout: 5 * time.Second}
	connection, err := dialer.DialContext(ctx, "tcp", address)
	if err != nil {
		return ProbeResult{}, fmt.Errorf("connect SSH: %w", err)
	}
	defer connection.Close()
	clientConn, channels, requests, err := ssh.NewClientConn(connection, address, sshConfig)
	if err != nil {
		return ProbeResult{}, fmt.Errorf("authenticate SSH: %w", err)
	}
	client := ssh.NewClient(clientConn, channels, requests)
	defer client.Close()
	session, err := client.NewSession()
	if err != nil {
		return ProbeResult{}, err
	}
	defer session.Close()
	type commandResult struct {
		output []byte
		err    error
	}
	done := make(chan commandResult, 1)
	go func() {
		output, commandErr := session.CombinedOutput(sampleCommand)
		done <- commandResult{output: output, err: commandErr}
	}()
	select {
	case <-ctx.Done():
		_ = client.Close()
		return ProbeResult{}, ctx.Err()
	case result := <-done:
		if result.err != nil {
			return ProbeResult{}, fmt.Errorf("collect metrics: %w", result.err)
		}
		sample, parseErr := parseSample(result.output, time.Now())
		return ProbeResult{HostKey: fingerprint, Sample: sample}, parseErr
	}
}

func verifyHostKey(expected, actual string) error {
	if expected != "" && expected != actual {
		return fmt.Errorf("SSH host key changed: got %s", actual)
	}
	return nil
}

func parseSample(data []byte, at time.Time) (rawSample, error) {
	sample := rawSample{at: at}
	scanner := bufio.NewScanner(strings.NewReader(string(data)))
	for scanner.Scan() {
		line := scanner.Text()
		key, value, found := strings.Cut(line, "=")
		if !found {
			continue
		}
		value = strings.TrimSpace(value)
		switch key {
		case "HOSTNAME":
			sample.hostname = value
		case "OS":
			sample.os = value
		case "KERNEL":
			sample.kernel = value
		case "CPU":
			fields := strings.Fields(value)
			for i, field := range fields[1:] {
				counter, _ := strconv.ParseUint(field, 10, 64)
				sample.cpuTotal += counter
				if i == 3 || i == 4 {
					sample.cpuIdle += counter
				}
			}
		case "MEMTOTAL_KB":
			sample.memoryTotal = parseUint(value) * 1024
		case "MEMAVAILABLE_KB":
			sample.memoryAvailable = parseUint(value) * 1024
		case "DISK":
			fields := strings.Fields(value)
			if len(fields) >= 2 {
				sample.diskTotal, sample.diskUsed = parseUint(fields[0]), parseUint(fields[1])
			}
		case "UPTIME":
			sample.uptime, _ = strconv.ParseFloat(value, 64)
		case "NET":
			fields := strings.Fields(value)
			if len(fields) >= 2 {
				sample.networkRX, sample.networkTX = parseUint(fields[0]), parseUint(fields[1])
			}
		case "IP":
			for _, address := range strings.Fields(value) {
				if !strings.Contains(address, "=") {
					sample.ipAddresses = append(sample.ipAddresses, address)
				}
			}
		case "TEMP_MILLI":
			milli, _ := strconv.ParseFloat(value, 64)
			sample.temperature = milli / 1000
		}
	}
	if err := scanner.Err(); err != nil {
		return rawSample{}, err
	}
	if sample.hostname == "" || sample.cpuTotal == 0 || sample.memoryTotal == 0 {
		return rawSample{}, errors.New("remote device returned incomplete Linux metrics")
	}
	return sample, nil
}

func snapshotFrom(current, previous rawSample, now time.Time) metrics.Snapshot {
	snapshot := metrics.Snapshot{
		Timestamp: now, Hostname: current.hostname, OS: current.os, Kernel: current.kernel,
		MemoryTotal: current.memoryTotal, DiskTotalBytes: current.diskTotal,
		DiskUsedBytes: current.diskUsed, TemperatureC: current.temperature,
		UptimeSeconds: current.uptime, IPAddresses: append([]string(nil), current.ipAddresses...),
	}
	if current.memoryTotal >= current.memoryAvailable {
		snapshot.MemoryUsedBytes = current.memoryTotal - current.memoryAvailable
		snapshot.MemoryPercent = round(100 * float64(snapshot.MemoryUsedBytes) / float64(current.memoryTotal))
	}
	if current.diskTotal > 0 {
		snapshot.DiskPercent = round(100 * float64(current.diskUsed) / float64(current.diskTotal))
	}
	if previous.cpuTotal > 0 && current.cpuTotal > previous.cpuTotal {
		total := current.cpuTotal - previous.cpuTotal
		idle := current.cpuIdle - previous.cpuIdle
		snapshot.CPUPercent = round(100 * (1 - float64(idle)/float64(total)))
	}
	if !previous.at.IsZero() {
		seconds := current.at.Sub(previous.at).Seconds()
		if seconds > 0 {
			if current.networkRX >= previous.networkRX {
				snapshot.NetworkRXBps = float64(current.networkRX-previous.networkRX) / seconds
			}
			if current.networkTX >= previous.networkTX {
				snapshot.NetworkTXBps = float64(current.networkTX-previous.networkTX) / seconds
			}
		}
	}
	return snapshot
}

func parseUint(value string) uint64 {
	result, _ := strconv.ParseUint(strings.TrimSpace(value), 10, 64)
	return result
}

func round(value float64) float64 { return float64(int(value*10+0.5)) / 10 }
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
