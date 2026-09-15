#!/usr/bin/env bash
#
# Deploy the portfolio site on the Raspberry Pi.
#
#   ./deploy.sh            deploy the current, pushed commit
#   ./deploy.sh --backend  also update Python deps and restart FastAPI
#
# The Next.js build goes into a scratch directory and is swapped in only
# after it succeeds, so a failed build can never corrupt the .next the running
# server is reading. If the health check fails afterwards, the previous build
# is restored and the service restarted again.
#
# Downtime: none for code and content changes. When package-lock.json has
# changed, the service is stopped for the reinstall (a few minutes on the Pi),
# because npm ci replaces node_modules and the running server reads from it.

set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/my-app" && pwd)"
SITE_URL="https://titouanguerin.com"
LOCAL_URL="http://localhost:3000"
BUILD_DIR="$APP_DIR/.next-build"
LIVE_DIR="$APP_DIR/.next"
PREV_DIR="$APP_DIR/.next-previous"
MODULES_DIR="$APP_DIR/node_modules"
MODULES_PREV="$APP_DIR/node_modules.previous"
LOCK_HASH_FILE="$MODULES_DIR/.deploy-lock-hash"
RESTART_BACKEND=0
SERVICE_STOPPED=0
DEPS_CHANGED=0

[[ "${1:-}" == "--backend" ]] && RESTART_BACKEND=1

log()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarning:\033[0m %s\n' "$*" >&2; }
fail() { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

restore_modules() {
  if [[ $DEPS_CHANGED -eq 1 && -d "$MODULES_PREV" ]]; then
    rm -rf "$MODULES_DIR"
    mv "$MODULES_PREV" "$MODULES_DIR"
  fi
}

start_if_stopped() {
  if [[ $SERVICE_STOPPED -eq 1 ]]; then
    sudo systemctl start nextjs-app.service
    SERVICE_STOPPED=0
  fi
}

cd "$APP_DIR"

# --- 1. Refuse to deploy anything that is not committed and pushed ----------
log "Checking working tree"
[[ -z "$(git status --porcelain)" ]] || fail "Uncommitted changes. Commit them first."

git fetch --quiet origin || fail "Could not reach origin."
if [[ -z "$(git branch -r --contains HEAD 2>/dev/null)" ]]; then
  fail "HEAD is not on any remote branch. Push first, so production never runs code that exists only on this Pi."
fi

# --- 2. Dependencies -------------------------------------------------------
lock_hash="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [[ ! -d "$MODULES_DIR" || "$(cat "$LOCK_HASH_FILE" 2>/dev/null)" != "$lock_hash" ]]; then
  DEPS_CHANGED=1
  log "Lockfile changed — stopping the service for the reinstall"
  sudo systemctl stop nextjs-app.service
  SERVICE_STOPPED=1

  rm -rf "$MODULES_PREV"
  [[ -d "$MODULES_DIR" ]] && mv "$MODULES_DIR" "$MODULES_PREV"

  if ! npm ci --no-audit --no-fund; then
    restore_modules
    start_if_stopped
    fail "npm ci failed. Previous node_modules restored and service restarted."
  fi
  echo "$lock_hash" > "$LOCK_HASH_FILE"
else
  log "Lockfile unchanged, skipping npm ci"
fi

if [[ $RESTART_BACKEND -eq 1 ]]; then
  log "Updating Python dependencies"
  ./app/venv/bin/pip install --quiet -r app/requirements.txt
fi

# --- 3. Build into a scratch directory -------------------------------------
log "Building (into .next-build)"
rm -rf "$BUILD_DIR"
if ! NEXT_DIST_DIR=".next-build" npm run build; then
  restore_modules
  start_if_stopped
  fail "Build failed. Nothing was swapped in; the site is serving the previous build."
fi

# --- 4. Swap the new build in ----------------------------------------------
log "Swapping in the new build"
rm -rf "$PREV_DIR"
[[ -d "$LIVE_DIR" ]] && mv "$LIVE_DIR" "$PREV_DIR"
mv "$BUILD_DIR" "$LIVE_DIR"

# --- 5. Restart ------------------------------------------------------------
log "Restarting services"
sudo systemctl restart nextjs-app.service
SERVICE_STOPPED=0
[[ $RESTART_BACKEND -eq 1 ]] && sudo systemctl restart fastapi-backend.service

# --- 6. Health check, with rollback ----------------------------------------
log "Health checking"
healthy=0
for _ in $(seq 1 20); do
  if curl -fsS --max-time 5 "$LOCAL_URL" 2>/dev/null | grep -q "Titouan Guerin"; then
    healthy=1
    break
  fi
  sleep 2
done

if [[ $healthy -ne 1 ]]; then
  printf '\033[1;31mHealth check failed — rolling back.\033[0m\n' >&2
  if [[ -d "$PREV_DIR" ]]; then
    rm -rf "$LIVE_DIR"
    mv "$PREV_DIR" "$LIVE_DIR"
    restore_modules
    sudo systemctl restart nextjs-app.service
    fail "Rolled back to the previous build. Check: sudo journalctl -u nextjs-app -n 50"
  fi
  fail "No previous build to roll back to. Check: sudo journalctl -u nextjs-app -n 50"
fi

if curl -fsS --max-time 5 "http://127.0.0.1:8000/health" >/dev/null 2>&1; then
  log "Backend healthy"
else
  warn "backend /health did not answer"
fi

# --- 7. Done ---------------------------------------------------------------
rm -rf "$PREV_DIR" "$MODULES_PREV"
log "Local site healthy"

if curl -fsS -o /dev/null --max-time 15 "$SITE_URL" 2>/dev/null; then
  log "Public site healthy — $SITE_URL"
else
  warn "$SITE_URL did not answer. Local site is fine, so check the tunnel: sudo systemctl status cloudflared"
fi

log "Deployed $(git rev-parse --short HEAD)"
