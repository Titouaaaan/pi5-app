#!/usr/bin/env bash
#
# Deploy the portfolio site on the Raspberry Pi.
#
#   ./deploy.sh            deploy the current branch's committed state
#   ./deploy.sh --backend  also restart the FastAPI service
#
# The build goes into a scratch directory and is swapped in only after it
# succeeds, so a failed build can never corrupt the .next that the running
# server is reading. If the health check fails afterwards, the previous
# build is put back and the service restarted again.

set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/my-app" && pwd)"
SITE_URL="https://titouanguerin.com"
LOCAL_URL="http://localhost:3000"
BUILD_DIR="$APP_DIR/.next-build"
LIVE_DIR="$APP_DIR/.next"
PREV_DIR="$APP_DIR/.next-previous"
RESTART_BACKEND=0

[[ "${1:-}" == "--backend" ]] && RESTART_BACKEND=1

log()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

cd "$APP_DIR"

# --- 1. Refuse to deploy anything that is not committed and pushed ----------
log "Checking working tree"
[[ -z "$(git status --porcelain)" ]] || fail "Uncommitted changes. Commit them first."

branch="$(git rev-parse --abbrev-ref HEAD)"
git fetch --quiet origin "$branch" || fail "Could not reach origin."
if [[ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/$branch")" ]]; then
  fail "HEAD differs from origin/$branch. Push first, so production never runs code that exists only on this Pi."
fi

# --- 2. Dependencies -------------------------------------------------------
if ! git diff --quiet HEAD@{1} HEAD -- package-lock.json 2>/dev/null; then
  log "Lockfile changed, running npm ci"
  npm ci --no-audit --no-fund
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
NEXT_DIST_DIR=".next-build" npm run build || fail "Build failed. Nothing was swapped in; the site is still serving the previous build."

# --- 4. Swap the new build in ----------------------------------------------
log "Swapping in the new build"
rm -rf "$PREV_DIR"
[[ -d "$LIVE_DIR" ]] && mv "$LIVE_DIR" "$PREV_DIR"
mv "$BUILD_DIR" "$LIVE_DIR"

# --- 5. Restart ------------------------------------------------------------
log "Restarting services"
sudo systemctl restart nextjs-app.service
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
    sudo systemctl restart nextjs-app.service
    fail "Rolled back to the previous build. The site should be up; check: sudo journalctl -u nextjs-app -n 50"
  fi
  fail "No previous build to roll back to. Check: sudo journalctl -u nextjs-app -n 50"
fi

curl -fsS --max-time 5 "http://127.0.0.1:8000/health" >/dev/null 2>&1 \
  && log "Backend healthy" \
  || printf '\033[1;33mwarning:\033[0m backend /health did not answer\n'

# --- 7. Done ---------------------------------------------------------------
rm -rf "$PREV_DIR"
log "Local site healthy"

if curl -fsS -o /dev/null --max-time 15 "$SITE_URL" 2>/dev/null; then
  log "Public site healthy — $SITE_URL"
else
  printf '\033[1;33mwarning:\033[0m %s did not answer. Local site is fine, so check the tunnel: sudo systemctl status cloudflared\n' "$SITE_URL"
fi

log "Deployed $(git rev-parse --short HEAD) ($branch)"
