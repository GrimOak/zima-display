package remote

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestSecretStoreUsesRestrictedFileAndPersistsPassword(t *testing.T) {
	directory := t.TempDir()
	store, err := NewSecretStore(directory)
	if err != nil {
		t.Fatal(err)
	}
	if err := store.Set("device-a", "correct horse battery staple"); err != nil {
		t.Fatal(err)
	}
	info, err := os.Stat(filepath.Join(directory, SecretsName))
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode().Perm() != 0o600 {
		t.Fatalf("secret file permissions = %o, want 600", info.Mode().Perm())
	}
	reloaded, err := NewSecretStore(directory)
	if err != nil {
		t.Fatal(err)
	}
	if got := reloaded.Password("device-a"); got != "correct horse battery staple" {
		t.Fatalf("reloaded password = %q", got)
	}
}

func TestParseSampleAndCalculateCounterDeltas(t *testing.T) {
	firstAt := time.Unix(100, 0)
	first, err := parseSample([]byte(strings.Join([]string{
		"HOSTNAME=nas-a", "CPU=cpu 100 0 50 800 50 0 0 0", "MEMTOTAL_KB=1000", "MEMAVAILABLE_KB=400",
		"DISK=10000 2500", "UPTIME=90", "NET=1000 2000", "IP=10.0.0.20", "TEMP_MILLI=42500", "KERNEL=6.1", "OS=Linux",
	}, "\n")), firstAt)
	if err != nil {
		t.Fatal(err)
	}
	second := first
	second.at = firstAt.Add(5 * time.Second)
	second.cpuTotal += 100
	second.cpuIdle += 25
	second.networkRX += 5000
	second.networkTX += 2500
	snapshot := snapshotFrom(second, first, second.at)
	if snapshot.Hostname != "nas-a" || snapshot.CPUPercent != 75 {
		t.Fatalf("unexpected snapshot identity/CPU: %#v", snapshot)
	}
	if snapshot.MemoryPercent != 60 || snapshot.DiskPercent != 25 {
		t.Fatalf("unexpected memory/disk percentages: %#v", snapshot)
	}
	if snapshot.NetworkRXBps != 1000 || snapshot.NetworkTXBps != 500 {
		t.Fatalf("unexpected network rates: %#v", snapshot)
	}
}

func TestVerifyHostKeyRejectsChangedFingerprint(t *testing.T) {
	if err := verifyHostKey("SHA256:known", "SHA256:known"); err != nil {
		t.Fatal(err)
	}
	if err := verifyHostKey("SHA256:known", "SHA256:changed"); err == nil {
		t.Fatal("expected changed host key to be rejected")
	}
}

func TestParseSampleDoesNotTreatFollowingMetricAsIPAddress(t *testing.T) {
	data := []byte("HOSTNAME=nas-a\nCPU=cpu 1 1 1 1 1\nMEMTOTAL_KB=1000\nMEMAVAILABLE_KB=500\nIP=TEMP_MILLI=42000\n")
	sample, err := parseSample(data, time.Now())
	if err != nil {
		t.Fatal(err)
	}
	if len(sample.ipAddresses) != 0 {
		t.Fatalf("invalid IP tokens were retained: %#v", sample.ipAddresses)
	}
}
