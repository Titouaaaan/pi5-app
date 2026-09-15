# Security notes

A record of the hardening applied to this project and of what is still
outstanding. Update it whenever the security posture changes.

## Fixed in the `rework` branch

| Issue | Before | After |
|---|---|---|
| **CORS wildcard with credentials** | `allow_origins=["*"]` together with `allow_credentials=True`, so any website could read the stats endpoint from a visitor's browser | `CORSMiddleware` removed entirely. The browser now reaches the backend through the same-origin `/api/*` rewrite, so cross-origin access is not needed |
| **Public API docs** | `api.titouanguerin.com/docs` served the interactive Swagger UI to the internet, advertising the API surface | `docs_url`, `redoc_url` and `openapi_url` all set to `None` |
| **Framework fingerprinting** | `X-Powered-By: Next.js` on every response | `poweredByHeader: false` |
| **Missing response headers** | none set | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` denying camera/microphone/geolocation |
| **GitHub API called from every visitor's browser** | each visitor hit `api.github.com` unauthenticated, against a 60-requests-per-hour-per-IP limit | fetched server-side in `Footer.tsx` and cached for an hour with `next: { revalidate: 3600 }` |
| **Undocumented Python dependencies** | no `requirements.txt`; the venv was unreproducible | `my-app/app/requirements.txt`, pinned |

## Still outstanding

These need changes outside the repo and are listed in the order they matter.

### 1. Rotate the Cloudflare tunnel token — highest priority

`/etc/systemd/system/cloudflared.service` contains the tunnel token inline and
is mode `644`, so **every local user can read it and run the tunnel**. The
token has also appeared in terminal output and shell history.

```bash
# Create a new token in the Cloudflare dashboard, then:
sudo install -m 600 /dev/null /etc/cloudflared/tunnel.env
sudo tee /etc/cloudflared/tunnel.env >/dev/null <<'EOF'
TUNNEL_TOKEN=<the new token>
EOF
sudo systemctl edit --full cloudflared.service   # see below
sudo systemctl daemon-reload && sudo systemctl restart cloudflared
```

In the unit, replace the inline token with:

```ini
EnvironmentFile=/etc/cloudflared/tunnel.env
ExecStart=/usr/bin/cloudflared --no-autoupdate tunnel run --token ${TUNNEL_TOKEN}
```

### 2. Bind the backend to localhost

`fastapi-backend.service` runs uvicorn with `--host 0.0.0.0`, so port 8000 is
reachable from the whole LAN and tailnet. Both cloudflared and uptime-kuma run
on this host, so nothing legitimate needs the wider bind:

```ini
ExecStart=.../uvicorn main:app --host 127.0.0.1 --port 8000
```

Check uptime-kuma's monitor URL afterwards — if it points at the Pi's LAN
address it must become `127.0.0.1`.

### 3. Retire the `api.` hostname

With the `/api/*` rewrite in place, `api.titouanguerin.com` is no longer used
by the site. Removing its tunnel route removes an entire public entry point.

### 4. Update cloudflared

Running 2025.9.1 against a current 2026.9.1, with `--no-autoupdate` set while a
`cloudflared-update.service` exists unused.

### 5. Remove the stale `pi.` DNS record

`pi.titouanguerin.com` returns Cloudflare error 1016 (origin DNS error). It is
a dead record still advertised in the old README.
