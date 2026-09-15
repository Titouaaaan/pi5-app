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

What it does, in order:

1. Refuses to run if the working tree has uncommitted changes, or if `HEAD`
   is not on any remote branch. Production never runs code that exists only
   on this Pi.
2. If `package-lock.json` changed since the last deploy, **stops the service**,
   sets the old `node_modules` aside and runs `npm ci`. This is the only case
   with downtime — a few minutes on the Pi — and it is deliberate: replacing
   `node_modules` under a running server is worse than a clean stop.
3. Builds into `.next-build`, a scratch directory the running server never
   reads. A failed build leaves the live site exactly as it was.
4. Swaps `.next-build` into `.next` (the previous build is kept as
   `.next-previous`) and restarts the service.
5. Polls `localhost:3000` for up to 40 s looking for the page. If it does not
   come up, restores the previous build (and previous `node_modules`, if
   they were replaced) and restarts again.
6. Checks the backend's `/health` and the public URL, warning rather than
   failing if either is unreachable — a tunnel problem is not a deploy
   problem.

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
```

Port 8000 is taken by the live backend, so run a development copy of the
backend on another port and point the `/api` rewrite at it:

```bash
# backend, in one shell
app/venv/bin/uvicorn main:app --app-dir app --port 8001 --reload

# frontend, in another
BACKEND_URL=http://127.0.0.1:8001 npm run dev -- -p 3002
```

The live site keeps serving its prebuilt `.next` from port 3000, untouched.

## Rolling back

A deploy that fails its health check rolls itself back; nothing to do.

To undo a deploy that *succeeded* but turned out to be wrong, revert on
`main` and deploy again:

```bash
git revert <commit>
git push
./deploy.sh
```

The `v1-original` tag is an archive of the site as it was before the redesign,
kept for reference. It predates `deploy.sh` and is **not deployable with it**.

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
