# Operations

How the site runs on the Raspberry Pi 5, and how to change it safely.

## Architecture

```
internet
   |
   v
Cloudflare tunnel (cloudflared.service, token mode)
   |
   +-- titouanguerin.com ------> localhost:3000   Next.js  (nextjs-app.service)
   |                                  |
   |                                  +-- /api/* rewritten to 127.0.0.1:8000
   |
   +-- api.titouanguerin.com --> localhost:8000   FastAPI  (fastapi-backend.service)
                                                  (legacy; see SECURITY.md #3)
```

The tunnel runs in **token mode**, which means its routing table lives in the
Cloudflare dashboard and **not** in any file on the Pi. There is no
`config.yml`. To re-derive the routes without the dashboard: grep
`journalctl -u cloudflared` for `originService=`, and probe a path unique to
each backend (`/health` only exists on FastAPI).

`pi.titouanguerin.com` is a **dead record** — Cloudflare error 1016.
The live site is the apex domain.

## Ports in use

| Port | Service |
|---|---|
| 3000 | Next.js production (`nextjs-app.service`) |
| 3001 | uptime-kuma |
| 8000 | FastAPI (`fastapi-backend.service`) |
| 8080 | uptime-kuma |

Use **3002** for development — 3001 looks free but answers with a misleading
302 from uptime-kuma.

## Deploying

```bash
./deploy.sh              # frontend only
./deploy.sh --backend    # also reinstall Python deps and restart FastAPI
```

The script refuses to deploy uncommitted or unpushed work, builds into a
scratch directory and swaps it in only on success, then health-checks and rolls
back automatically if the site does not come up.

**Do not run `npm run build` by hand in the live tree.** `next start` reads
static chunks lazily off disk, so a build that fails partway can break the live
site before any restart, with no clean rollback. That is the specific problem
`deploy.sh` exists to prevent.

## Developing

The live service's working directory *is* the repository, so develop in a
separate git worktree rather than editing the live tree:

```bash
git worktree add -b my-feature /home/titouan/work
cd /home/titouan/work/my-app && npm install
npm run dev -- -p 3002
```

The live site keeps serving its prebuilt `.next` from port 3000, untouched.

## Rolling back

`deploy.sh` rolls back on its own if a deploy fails its health check. To go
back further, the pre-redesign site is permanently tagged:

```bash
git checkout v1-original && ./deploy.sh
```

## Service management

```bash
sudo systemctl status nextjs-app.service
sudo systemctl restart nextjs-app.service
sudo journalctl -u nextjs-app.service -n 50 -f
```

Same for `fastapi-backend.service` and `cloudflared.service`. All three are
enabled and start on boot.

## Backend API

Reached by the browser only through the same-origin `/api/*` rewrite.

| Endpoint | Purpose |
|---|---|
| `GET /health` | liveness probe, used by `deploy.sh` and suitable for uptime-kuma |
| `GET /system-stats` | CPU, memory, disk and uptime, shown in the site footer |

Interactive docs are disabled deliberately — see `SECURITY.md`.
