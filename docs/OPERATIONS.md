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
   +-- api.titouanguerin.com --> localhost:8000   FastAPI  (fastapi-backend.service, backend/)
                                                  (legacy hostname; see SECURITY.md #3)
```

The tunnel runs in **token mode**, which means its routing table lives in the
Cloudflare dashboard and **not** in any file on the Pi. There is no
`config.yml`. To re-derive the routes without the dashboard: grep
`journalctl -u cloudflared` for `originService=`, and probe a path unique to
each backend (`/health` only exists on FastAPI).

`www.titouanguerin.com` redirects to the apex (Cloudflare redirect rule).
`pi.titouanguerin.com` is a **dead record**, Cloudflare error 1016.
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
   with downtime, a few minutes on the Pi, and it is deliberate: replacing
   `node_modules` under a running server is worse than a clean stop.
3. With `--backend`: creates `backend/.venv` if missing, installs
   `backend/requirements.txt`, and if `deploy/fastapi-backend.service` differs
   from the copy in `/etc/systemd/system/`, installs it and reloads systemd.
4. Records the commit and time as `.deploy/info.json` and bakes both into the
   page footer, then builds into `.next-build`, a scratch directory the
   running server never reads. A failed build leaves the live site exactly as
   it was.
5. Swaps `.next-build` into `.next` (the previous build is parked in
   `.deploy/`) and restarts the service(s).
6. Polls `localhost:3000` for up to 40 s until the page **contains the commit
   hash it just built**. If it does not, restores the previous build (and
   previous `node_modules`, if they were replaced) and restarts again.
7. Asks the backend's `/deploy` which commit it is running and warns if it
   differs (that means `--backend` was needed). Checks the public URL, warning
   rather than failing if the tunnel is the problem.

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
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn app.main:app --port 8001 --reload
.venv/bin/python -m pytest               # run the tests

# frontend, in another
cd my-app
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

## Keeping dependencies current

```bash
cd my-app
npm outdated        # what has moved
npm update          # everything within its semver range
npm audit           # must be 0 before deploying
npm run lint && npx tsc --noEmit && npm run build
```

Held deliberately on their current major: **Next 15.x**, **Tailwind 3.x**,
**ESLint 9.x** (`eslint-config-next` caps at 9), **TypeScript 5.x**. Each of
those majors is a real migration and should be done on its own, not as part of
a routine update. When Next goes to 16, drop the `postcss` override in
`package.json` (see `SECURITY.md`) and note that `next lint` is gone — the
`lint` script already uses the ESLint CLI directly in readiness.

Node on the Pi is 20.x. Next 15.5 requires 18.18+; Next 16 requires 20.9+.

## Service management

```bash
sudo systemctl status nextjs-app.service
sudo systemctl restart nextjs-app.service
sudo journalctl -u nextjs-app.service -n 50 -f
```

Same for `fastapi-backend.service` and `cloudflared.service`. All three are
enabled and start on boot.

## Backend API

Documented endpoint by endpoint, with response shapes, caching and upstream
sources, in [API.md](API.md). Short version: `/health`, `/system-stats`,
`/deploy`, `/github/activity`, `/publications`, `POST /visit`, `/visits`, all
under `https://titouanguerin.com/api/`.

Code lives in `backend/app/`, one module per concern, with tests in
`backend/tests/`. The systemd unit is versioned at
`deploy/fastapi-backend.service` and installed by `deploy.sh --backend`;
never edit the copy in `/etc` by hand.

## Colours and themes

Tokens are CSS variables in `my-app/app/globals.css`, one set under `:root`
and one under `prefers-color-scheme: dark`; Tailwind classes (`text-faint`,
`bg-paper`, ...) read them, so components carry no theme logic. Every text
colour clears WCAG AA, 4.5:1, on its background. Measured 2026-09-15:

| Token | Light | ratio | Dark | ratio | Used for |
|---|---|---|---|---|---|
| `ink` | `#16191C` | 16.9 | `#E8EBEE` | 15.4 | name, headings |
| `body` | `#2A3036` | 12.8 | `#D2D6DA` | 12.6 | paragraphs |
| `muted` | `#545C64` | 6.5 | `#A4ACB3` | 8.0 | tagline, project bodies |
| `faint` | `#606870` | 5.6 | `#8A939B` | 5.9 | section labels, dates |
| `fainter` | `#6E767E` | 4.5 | `#7A838B` | 4.8 | footer, metadata |

Before changing one, re-check the ratio (any online contrast checker, or the
three-line Python in the git history of this file's commit). The
institution logos get a light tile behind them in dark mode, since one is a
white-background PNG.

## Search engines and sharing

Generated at build, all from `my-app/app/`:

| Path | Source | What it is |
|---|---|---|
| `/robots.txt` | `robots.ts` | allows everything except `/api/`, points at the sitemap. Cloudflare prepends its own "content signals" comment block at the edge; the directives are ours |
| `/sitemap.xml` | `sitemap.ts` | the one page, `lastmod` = deploy time |
| `/icon` | `icon.tsx` | the favicon, a `#` on ink, 64px |
| `/opengraph-image` | `opengraph-image.tsx` | the 1200×630 card shown when the link is shared; built from `content/profile.ts` with the site's own fonts |
| JSON-LD in `<head>` | `components/StructuredData.tsx` | schema.org `Person` (affiliations, profiles, topics) and one `ScholarlyArticle` per entry in `content/publications.ts` |

Title, description, canonical URL and Open Graph tags are in `layout.tsx`.
