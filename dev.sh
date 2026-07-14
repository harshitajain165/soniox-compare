#!/usr/bin/env bash
#
# Runs stt, tts and translate together for local development.
#
#   stt        http://localhost:5173   backend on :8000
#   tts        http://localhost:5174   backend on :8001
#   translate  http://localhost:5175   backend on :8002
#
# Ports can be overridden, e.g. TTS_UI_PORT=6000 ./dev.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

STT_API_PORT="${STT_API_PORT:-8000}"
TTS_API_PORT="${TTS_API_PORT:-8001}"
TRANSLATE_API_PORT="${TRANSLATE_API_PORT:-8002}"
STT_UI_PORT="${STT_UI_PORT:-5173}"
TTS_UI_PORT="${TTS_UI_PORT:-5174}"
TRANSLATE_UI_PORT="${TRANSLATE_UI_PORT:-5175}"

pids=""

log() { printf '\033[1;36m[dev]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[dev]\033[0m %s\n' "$*" >&2; exit 1; }

# uvicorn's reloader and vite both fork children that survive a kill of the parent.
kill_tree() {
  local pid="$1" child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null || true
}

cleanup() {
  trap - INT TERM EXIT
  local pid
  for pid in $pids; do kill_tree "$pid"; done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# start <label> <color> <dir> <command...>
start() {
  local label="$1" color="$2" dir="$3"
  shift 3
  local prefix
  prefix="$(printf '\033[1;%sm[%s]\033[0m ' "$color" "$label")"
  (
    cd "$ROOT/$dir"
    "$@" 2>&1 | awk -v prefix="$prefix" '{ print prefix $0; fflush() }'
  ) &
  pids="$pids $!"
}

for tool in uv yarn; do
  command -v "$tool" >/dev/null 2>&1 || die "$tool is not installed"
done

for port in "$STT_API_PORT" "$TTS_API_PORT" "$TRANSLATE_API_PORT" "$STT_UI_PORT" "$TTS_UI_PORT" "$TRANSLATE_UI_PORT"; do
  lsof -i ":$port" -sTCP:LISTEN >/dev/null 2>&1 && die "port $port is already in use"
done

for project in stt tts translate; do
  [ -f "$ROOT/$project/.env" ] || log "$project/.env is missing, its providers will return errors"
done

for project in stt tts translate; do
  if [ ! -d "$ROOT/$project/frontend/node_modules" ]; then
    log "installing $project frontend dependencies"
    (cd "$ROOT/$project/frontend" && yarn install --frozen-lockfile)
  fi
done

# Each backend mounts frontend/dist and serves it on its API port, so a dist
# left over from an earlier run keeps serving stale UI code there even though
# vite is serving the current source on the UI port. Rebuild every time rather
# than only when dist is absent. Note this is still a snapshot: edits made after
# startup reach the UI ports live, but not the API ports until the next run.
log "building frontends"
build_pids=()
for project in stt tts translate; do
  (cd "$ROOT/$project/frontend" && yarn build >/dev/null) &
  build_pids+=("$!")
done
for pid in "${build_pids[@]}"; do
  wait "$pid" || die "frontend build failed"
done

start "stt-api"       32 stt       uv run fastapi dev main.py --port "$STT_API_PORT"
start "tts-api"       33 tts       env DEV=1 uv run fastapi dev main.py --port "$TTS_API_PORT"
start "translate-api" 35 translate uv run fastapi dev main.py --port "$TRANSLATE_API_PORT"

start "stt-ui" 92 stt/frontend \
  env BACKEND_URL="http://127.0.0.1:$STT_API_PORT" yarn dev --port "$STT_UI_PORT" --strictPort
start "tts-ui" 93 tts/frontend \
  env BACKEND_URL="http://127.0.0.1:$TTS_API_PORT" yarn dev --port "$TTS_UI_PORT" --strictPort
start "translate-ui" 94 translate/frontend \
  env BACKEND_URL="http://127.0.0.1:$TRANSLATE_API_PORT" yarn dev --port "$TRANSLATE_UI_PORT" --strictPort

cat <<EOF

  stt        http://localhost:$STT_UI_PORT
  tts        http://localhost:$TTS_UI_PORT
  translate  http://localhost:$TRANSLATE_UI_PORT

EOF

wait
