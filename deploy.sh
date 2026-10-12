#!/usr/bin/env bash
#
# Deploy the portfolio site on the Raspberry Pi.
#
#   ./deploy.sh            deploy the current, pushed commit
#   ./deploy.sh --backend  also (re)build the backend venv, install its systemd
#                          unit from deploy/, and restart FastAPI
#
# The Next.js build goes into a scratch directory and is swapped in only
# after it succeeds, so a failed build can never corrupt the .next the running
# server is reading. If the health check fails afterwards, the previous build
# is restored and the service restarted again.
#
# Downtime: only the restart itself. When package-lock.json has changed, npm ci
# and the build run in a staging copy of my-app (.deploy/stage), and the new
# node_modules is swapped in together with the new build, just before the
# restart, so the running server never reads a half-installed node_modules.

set -Eeuo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$REPO_DIR/my-app"
SITE_URL="https://titouanguerin.com"
LOCAL_URL="http://localhost:3000"
BUILD_DIR="$APP_DIR/.next-build"
LIVE_DIR="$APP_DIR/.next"
MODULES_DIR="$APP_DIR/node_modules"
# Previous build and modules are parked OUTSIDE my-app/ so that no tool run
# inside the project (tsc's "**/*.ts" include, in particular) can crawl them.
KEEP_DIR="$REPO_DIR/.deploy"
PREV_DIR="$KEEP_DIR/next-previous"
MODULES_PREV="$KEEP_DIR/node_modules-previous"
STAGE_DIR="$KEEP_DIR/stage"
DEPLOY_INFO="$KEEP_DIR/info.json"
BACKEND_DIR="$REPO_DIR/backend"
BACKEND_VENV="$BACKEND_DIR/.venv"
BACKEND_UNIT_SRC="$REPO_DIR/deploy/fastapi-backend.service"
BACKEND_UNIT_DST="/etc/systemd/system/fastapi-backend.service"
LOCK_HASH_FILE="$MODULES_DIR/.deploy-lock-hash"
RESTART_BACKEND=0
STAGED=0
SWAPPED=0
DEPS_CHANGED=0
RESTARTED=0

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

# If the script dies for any reason it did not plan for (Ctrl-C, a closed
# terminal, a killed tool), do not leave the site half-swapped. The service is
# never stopped, so before the restart restoring the files is enough; after
# the restart the new build is what is running, so it is left in place.
# The planned failure paths restore what they need themselves; for them
# this is a no-op because their flags are clear by the time they exit.
abort_cleanup() {
  local code=$?
  trap - EXIT
  rm -rf "$STAGE_DIR"
  if [[ $code -ne 0 ]]; then
    if [[ $RESTARTED -eq 1 ]]; then
      printf '\033[1;31mAborted (exit %s) after the restart. The new build is live; health check not finished.\033[0m\n' "$code" >&2
    else
      if [[ $SWAPPED -eq 1 && -d "$PREV_DIR" ]]; then rm -rf "$LIVE_DIR"; mv "$PREV_DIR" "$LIVE_DIR"; fi
      restore_modules
      printf '\033[1;31mAborted (exit %s). Previous build and modules kept; service running.\033[0m\n' "$code" >&2
    fi
  fi
  exit "$code"
}
trap abort_cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

cd "$APP_DIR"
mkdir -p "$KEEP_DIR"

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
  log "Lockfile changed — installing into a staging copy (the site stays up)"
  rm -rf "$STAGE_DIR"
  # The tree is clean (checked above), so this copy is HEAD plus ignored env files.
  rsync -a --exclude node_modules --exclude .next --exclude .next-build \
    --exclude tsconfig.tsbuildinfo "$APP_DIR/" "$STAGE_DIR/"
  (cd "$STAGE_DIR" && npm ci --no-audit --no-fund) \
    || fail "npm ci failed. Nothing was swapped; the site is untouched."
  echo "$lock_hash" > "$STAGE_DIR/node_modules/.deploy-lock-hash"
  STAGED=1
else
  log "Lockfile unchanged, skipping npm ci"
fi

if [[ $RESTART_BACKEND -eq 1 ]]; then
  log "Updating backend"
  [[ -x "$BACKEND_VENV/bin/pip" ]] || python3 -m venv "$BACKEND_VENV"
  # The Pi's Python seeds venvs with an old setuptools; keep the tooling current too.
  "$BACKEND_VENV/bin/pip" install --quiet --upgrade pip setuptools
  "$BACKEND_VENV/bin/pip" install --quiet -r "$BACKEND_DIR/requirements.txt"
  if ! sudo cmp -s "$BACKEND_UNIT_SRC" "$BACKEND_UNIT_DST"; then
    log "Installing updated systemd unit"
    sudo install -m 644 "$BACKEND_UNIT_SRC" "$BACKEND_UNIT_DST"
    sudo systemctl daemon-reload
  fi
fi

# --- 3. Build into a scratch directory -------------------------------------
COMMIT="$(git rev-parse --short HEAD)"
DEPLOYED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '{"commit":"%s","deployed_at":"%s"}\n' "$COMMIT" "$DEPLOYED_AT" > "$DEPLOY_INFO.next"

# With new dependencies the build runs in the staging copy, against them.
# A build is portable between directories: next start does not read the
# absolute paths in required-server-files.json (verified 2026-10-12).
BUILD_ROOT="$APP_DIR"
[[ $STAGED -eq 1 ]] && BUILD_ROOT="$STAGE_DIR"

log "Building $COMMIT (into .next-build)"
rm -rf "$BUILD_DIR" "$STAGE_DIR/.next-build"
if ! (cd "$BUILD_ROOT" && NEXT_DIST_DIR=".next-build" NEXT_PUBLIC_DEPLOY_COMMIT="$COMMIT" NEXT_PUBLIC_DEPLOY_AT="${DEPLOYED_AT%%T*}" npm run build); then
  fail "Build failed. Nothing was swapped in; the site is serving the previous build."
fi
[[ $STAGED -eq 1 ]] && mv "$STAGE_DIR/.next-build" "$BUILD_DIR"

# --- 4. Swap the new build in ----------------------------------------------
log "Swapping in the new build"
if [[ $STAGED -eq 1 ]]; then
  rm -rf "$MODULES_PREV"
  [[ -d "$MODULES_DIR" ]] && mv "$MODULES_DIR" "$MODULES_PREV"
  DEPS_CHANGED=1
  mv "$STAGE_DIR/node_modules" "$MODULES_DIR"
fi
rm -rf "$PREV_DIR"
SWAPPED=1
[[ -d "$LIVE_DIR" ]] && mv "$LIVE_DIR" "$PREV_DIR"
mv "$BUILD_DIR" "$LIVE_DIR"
mv "$DEPLOY_INFO.next" "$DEPLOY_INFO"

# --- 5. Restart ------------------------------------------------------------
log "Restarting services"
sudo systemctl restart nextjs-app.service
RESTARTED=1
[[ $RESTART_BACKEND -eq 1 ]] && sudo systemctl restart fastapi-backend.service

# --- 6. Health check, with rollback ----------------------------------------
log "Health checking"
healthy=0
for _ in $(seq 1 20); do
  if curl -fsS --max-time 5 "$LOCAL_URL" 2>/dev/null | grep -q "$COMMIT"; then
    healthy=1
    break
  fi
  sleep 2
done

if [[ $healthy -ne 1 ]]; then
  printf '\033[1;31mHealth check failed — rolling back.\033[0m\n' >&2
  RESTARTED=0
  if [[ -d "$PREV_DIR" ]]; then
    rm -rf "$LIVE_DIR"
    mv "$PREV_DIR" "$LIVE_DIR"
    restore_modules
    sudo systemctl restart nextjs-app.service
    fail "Rolled back to the previous build. Check: sudo journalctl -u nextjs-app -n 50"
  fi
  fail "No previous build to roll back to. Check: sudo journalctl -u nextjs-app -n 50"
fi

backend_commit="$(curl -fsS --max-time 5 "http://127.0.0.1:8000/deploy" 2>/dev/null | sed -n 's/.*"commit":"\([^"]*\)".*/\1/p')"
if [[ "$backend_commit" == "$COMMIT" ]]; then
  log "Backend healthy, reports $COMMIT"
elif [[ -n "$backend_commit" ]]; then
  warn "backend is up but reports $backend_commit, not $COMMIT. If main.py or the unit changed, run with --backend."
else
  warn "backend /deploy did not answer"
fi

# --- 7. Done ---------------------------------------------------------------
rm -rf "$PREV_DIR" "$MODULES_PREV"
log "Local site healthy"

if curl -fsS -o /dev/null --max-time 15 "$SITE_URL" 2>/dev/null; then
  log "Public site healthy — $SITE_URL"
else
  warn "$SITE_URL did not answer. Local site is fine, so check the tunnel: sudo systemctl status cloudflared"
fi

log "Deployed $COMMIT at $DEPLOYED_AT"
