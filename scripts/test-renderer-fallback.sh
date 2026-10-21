#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
TEST_DIR=$(mktemp -d "${TMPDIR:-/tmp}/zima-display-renderer.XXXXXX")
trap 'rm -rf "$TEST_DIR"' EXIT INT TERM

RUNTIME_DIR="$TEST_DIR/run"
DATA_DIR="$TEST_DIR/data"
DRM_DIR="$TEST_DIR/drm"
MOCK_BIN="$TEST_DIR/bin"
MPV_LOG="$TEST_DIR/mpv.log"
mkdir -p "$RUNTIME_DIR" "$DATA_DIR" "$DRM_DIR/card0-HDMI-A-1" "$MOCK_BIN"
echo connected > "$DRM_DIR/card0-HDMI-A-1/status"

cat > "$MOCK_BIN/mpv" <<'PY'
#!/usr/bin/env python3
import os
import socket
import sys
import time

with open(os.environ["MOCK_MPV_LOG"], "a", encoding="utf-8") as log:
    log.write(" ".join(sys.argv[1:]) + "\n")

if "--vo=gpu-next" in sys.argv:
    raise SystemExit(42)

socket_arg = next(arg for arg in sys.argv if arg.startswith("--input-ipc-server="))
socket_path = socket_arg.split("=", 1)[1]
server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server.bind(socket_path)
server.listen(1)
time.sleep(0.75)
server.close()
PY
chmod 0755 "$MOCK_BIN/mpv"

run_renderer() {
    MOCK_MPV_LOG="$MPV_LOG" \
    ZIMA_DISPLAY_RUNTIME_DIR="$RUNTIME_DIR" \
    ZIMA_DISPLAY_DATA_DIR="$DATA_DIR" \
    ZIMA_DISPLAY_DRM_DIR="$DRM_DIR" \
    ZIMA_DISPLAY_MPV_BIN="$MOCK_BIN/mpv" \
    ZIMA_DISPLAY_TEST_MAX_RENDER_CYCLES=1 \
        "$PROJECT_DIR/packaging/raw/usr/libexec/zima-display/start-renderer"
}

run_renderer
[ -f "$RUNTIME_DIR/gpu-drm-attempted" ] || {
    echo "GPU attempt marker was not created" >&2
    exit 1
}
[ -f "$RUNTIME_DIR/software-renderer" ] || {
    echo "software fallback marker was not created" >&2
    exit 1
}
[ "$(wc -l < "$MPV_LOG" | tr -d ' ')" = 2 ] || {
    echo "expected one GPU attempt and one software attempt" >&2
    cat "$MPV_LOG" >&2
    exit 1
}
sed -n '1p' "$MPV_LOG" | grep -q -- '--vo=gpu-next --gpu-context=drm'
sed -n '2p' "$MPV_LOG" | grep -q -- '--vo=drm --hwdec=no'

: > "$MPV_LOG"
rm -f "$RUNTIME_DIR/software-renderer"
run_renderer
[ -f "$RUNTIME_DIR/software-renderer" ] || {
    echo "renderer did not select software after an interrupted GPU attempt" >&2
    exit 1
}
[ "$(wc -l < "$MPV_LOG" | tr -d ' ')" = 1 ] || {
    echo "renderer retried GPU after the boot-scoped fallback was selected" >&2
    cat "$MPV_LOG" >&2
    exit 1
}
grep -q -- '--vo=drm --hwdec=no' "$MPV_LOG"
if grep -q -- '--vo=gpu-next' "$MPV_LOG"; then
    echo "renderer retried GPU after the boot-scoped fallback was selected" >&2
    exit 1
fi

echo "renderer fallback test passed"
