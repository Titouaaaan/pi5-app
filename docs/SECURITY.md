# Security notes

A record of the hardening applied to this project and of what is still
outstanding. Update it whenever the security posture changes.

## Fixed in the `rework` branch

| Issue | Before | After |
|---|---|---|
| **CORS wildcard with credentials** | `allow_origins=["*"]` together with `allow_credentials=True`, so any website could read the stats endpoint from a visitor's browser | `CORSMiddleware` removed entirely. The browser now reaches the backend through the same-origin `/api/*` rewrite, so cross-origin access is not needed |
| **Public API docs** | `api.titouanguerin.com/docs` served the interactive Swagger UI to the internet, advertising the API surface | `docs_url`, `redoc_url` and `openapi_url` all set to `None` |
| **Framework fingerprinting** | `X-Powered-By: Next.js` on every response | `poweredByHeader: false` |
| **Missing response headers** | none set | `Strict-Transport-Security` (2 years, subdomains), `Content-Security-Policy` (see below), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` denying camera/microphone/geolocation |
| **GitHub API called from every visitor's browser** | each visitor hit `api.github.com` unauthenticated, against a 60-requests-per-hour-per-IP limit | fetched server-side in `Footer.tsx` and cached for an hour with `next: { revalidate: 3600 }` |
| **Undocumented Python dependencies** | no `requirements.txt`; the venv was unreproducible | `backend/requirements.txt`, pinned; `deploy.sh --backend` rebuilds the venv from it |

## Content-Security-Policy

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com;
frame-ancestors 'none';
base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
```

Everything the page needs is same-origin (fonts self-hosted by `next/font`,
images local, API under `/api`), so every directive except two is strict.
The one foreign origin is `frame-src` for the RL-Souls video, which is an
iframe mounted only while that project row is open, on the no-cookie
YouTube domain.
`script-src` and `style-src` carry `'unsafe-inline'` because Next's hydration
script and Tailwind's styles are inline; removing it needs a per-request
nonce, which turns the static page into a dynamic one. The trade is
deliberate: the remaining directives still block loading scripts, styles,
frames or connections from any other origin.

## Verified 2026-09-15, from the public URL

- Response headers as listed above present; `X-Powered-By` absent
- `/api/docs`, `/api/openapi.json`, `/api/redoc` all 404
- `/.env`, `/.git/HEAD`, path-traversal probes all 404
- No `Access-Control-*` headers on any response, including cross-origin `POST /api/visit`
- `npm audit` 0, `pip-audit` (inside the live venv) 0
- Backend process runs as `titouan`, from the versioned unit, from `backend/.venv`
- `http://` redirects to `https://` (Cloudflare "Always Use HTTPS", enabled 2026-09-15)
- `www.titouanguerin.com` resolves and 301s to the apex (CNAME + redirect rule, added 2026-09-15); a resolver that looked it up before that may cache "no such name" for up to 30 minutes

## Dependencies

Audited and brought to **0 vulnerabilities** on 2026-09-15. Next moved from
15.1.3 (January 2025, one critical and several high advisories) to 15.5.25, the
latest on the 15.x line; everything else updated within its semver range.

One fix needed a hand: Next 15.5 still pins a vulnerable nested `postcss`
(build-time advisories — attacker-controlled CSS input, which does not apply
here, but an advisory is an advisory). `package.json` carries

```json
"overrides": { "next": { "postcss": "8.5.28" } }
```

which is the same pin Next itself adopted in 16. Remove the override when Next
is upgraded to 16.

**Python:** `fastapi` only sets a floor on `starlette`, so `starlette` is pinned
explicitly in `backend/requirements.txt`; otherwise `pip install -r` leaves an
old one in place. Audit the backend with `pip-audit` (in
`requirements-dev.txt`) run **inside the venv**, not with `-r`, so it checks
what is installed rather than what a fresh resolve would pick.

**Before every deploy:** `npm audit` in `my-app/` and `pip-audit` in
`backend/.venv` must both report nothing.
If it does not, `npm update` first; if an advisory only resolves with a major
bump, treat that as its own change with its own test cycle rather than folding
it into a deploy.

## Visitor counter

`POST /visit` records `sha256(ip + day + secret)`. The daily component means
the same person on two days yields two unrelated hashes, so nothing can be
joined across days; the secret (`.data/visits.secret`, mode 600, generated on
first run) means the hash cannot be reversed from the IP space by anyone who
reads the database. No cookies are set and no address is stored. This is
counting, not analytics.

The client address is taken from `CF-Connecting-IP` (set by Cloudflare and
verified to survive the Next.js rewrite). Direct LAN requests to port 8000
could spoof that header to inflate the count; binding to `127.0.0.1` (item 1
below) closes that.

## Tunnel token (fixed 2026-09-17)

The tunnel token used to sit inline in `/etc/systemd/system/cloudflared.service`
(mode 644, so readable by every local user, and visible to everyone in `ps`)
and had been pasted into terminals. Now:

- The token was rotated in the dashboard (Networking > Tunnels > the tunnel >
  Overview > **Rotate token**), which invalidated the old one.
- It lives only in `/etc/cloudflared/tunnel.env` (root, mode 600) as
  `TUNNEL_TOKEN=...`, loaded by `EnvironmentFile=` in the unit. cloudflared
  reads that variable natively, so `ExecStart` is just
  `cloudflared --no-autoupdate tunnel run`: nothing on the command line, and a
  root process's environment is not readable by other users.
- The unit (mode 644) contains no secret and is safe to read or commit.

To rotate again: Rotate token in the dashboard, then on the Pi
`read -rs TOKEN`, paste, and
`printf 'TUNNEL_TOKEN=%s\n' "$TOKEN" | sudo tee /etc/cloudflared/tunnel.env >/dev/null; unset TOKEN`,
then `sudo systemctl restart cloudflared`. Running connections survive until
the restart, so there is no window to plan around.

## Still outstanding

These need changes outside the repo and are listed in the order they matter.

### 1. Bind the backend to localhost

The unit (versioned at `deploy/fastapi-backend.service`) runs uvicorn with
`--host 0.0.0.0`, so port 8000 is reachable from the whole LAN and tailnet.
Nothing off the Pi needs it: the tunnel, Next's `/api` rewrite and
`deploy.sh` all use `localhost`/`127.0.0.1`, so no Cloudflare change is
involved. The one consumer of the LAN address is uptime-kuma's "FastApi"
monitor, and uptime-kuma runs as a plain systemd service on the Pi (not in
Docker), so `127.0.0.1` from it is the Pi.

**TODO, from home (uptime-kuma is only reachable on the LAN):**

1. Open uptime-kuma at `http://192.168.1.41:3001` from a device on the
   home Wi-Fi.
2. **FastApi** monitor → **Edit** → set the URL to
   `http://127.0.0.1:8000/health` → **Save**. It goes green within one
   check interval. (`/health` is the liveness probe; `/system-stats` works
   too but does real work on every poll.)
3. Then, in `deploy/fastapi-backend.service`, change `--host 0.0.0.0` to
   `--host 127.0.0.1`, drop the comment above it, commit, and run
   `./deploy.sh --backend`. Verify: `curl http://192.168.1.41:8000/health`
   from the Pi must fail to connect, `curl http://127.0.0.1:8000/health`
   must answer.

Step 3 can be done before step 1 at the cost of the monitor showing red
until it is repointed; the site itself is unaffected either way.

### 2. Retire the `api.` hostname

With the `/api/*` rewrite in place, `api.titouanguerin.com` is no longer used
by the site. Removing its tunnel route removes an entire public entry point.

### 3. Update cloudflared

Running 2025.9.1 against a current 2026.9.1, with `--no-autoupdate` set while a
`cloudflared-update.service` exists unused.

### 4. Remove the stale `pi.` DNS record

`pi.titouanguerin.com` returns Cloudflare error 1016 (origin DNS error). It is
a dead record still advertised in the old README.
