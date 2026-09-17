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
                                      |
                                      +-- /api/* rewritten to 127.0.0.1:8000
                                                 FastAPI  (fastapi-backend.service, backend/)
                                                 listens on 127.0.0.1 only
```

The tunnel runs in **token mode**, which means its routing table lives in the
Cloudflare dashboard and **not** in any file on the Pi. There is no
`config.yml`. To re-derive the routes without the dashboard: grep
`journalctl -u cloudflared` for `originService=`, and probe a path unique to
each backend (`/health` only exists on FastAPI).

`www.titouanguerin.com` redirects to the apex (Cloudflare redirect rule).
The live site is the apex domain; it is the tunnel's only route. `api.` and
`pi.` subdomains were retired on 2026-09-17.

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
python3 -m venv --upgrade-deps .venv && .venv/bin/pip install -r requirements-dev.txt
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

## Continuous integration

`.github/workflows/checks.yml` runs the pre-deploy checks on GitHub's
machines on every push to `main` or `rework`, on pull requests, and every
Monday at 08:00 UTC: `npm ci`, lint, `tsc`, `next build`, `npm audit` for
the frontend; pytest and `pip-audit` for the backend. The weekly run is
what makes a new advisory against an existing dependency visible without
anyone running an audit by hand. It never deploys and has no access to the
Pi; `deploy.sh` remains the only path to production, and a red run does not
block it. Results: `gh run list`, or the Actions tab.

## Keeping dependencies current

```bash
cd my-app
npm outdated        # what has moved
npm update          # everything within its semver range
npm audit           # must be 0 before deploying
npm run lint && npx tsc --noEmit && npm run build
```

Next moved to **16.x** and Tailwind to **4.x** on 2026-09-17. Still held on
their current major: **ESLint 9.x** and **TypeScript 5.x**. ESLint 10 was
tried on 2026-09-17 and is blocked upstream: `eslint-config-next` allows it,
but its dependency `eslint-plugin-react` (7.37.5, the latest) still calls
`context.getFilename()`, removed in 10, and crashes on the first rule. Retry
when `eslint-plugin-react` publishes a release whose peer range includes
`eslint@10`: `npm view eslint-plugin-react peerDependencies.eslint`. Each is a real migration and should be done on its own,
not as part of a routine update.

Node on the Pi is **22.x** (LTS until April 2027), installed from NodeSource's
apt repo (`/etc/apt/sources.list.d/nodesource.list`, `node_22.x` channel);
moved from 20.x on 2026-09-17 after Node 20 reached end-of-life. To move to
the next LTS: change the channel in that file, `apt update && apt install
nodejs`, then `./deploy.sh` (rebuilds and health-checks under the new
runtime) and `sudo systemctl restart uptime-kuma`, which shares the binary.
Native addons (Next's SWC, sharp, uptime-kuma's sqlite3) are N-API and
survive a major bump without `npm ci`. Next 16 requires Node 20.9+.

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
and one under `prefers-color-scheme: dark`. The `@theme inline` block at the
top of that file maps them to Tailwind 4 classes (`text-faint`, `bg-paper`,
...); there is no `tailwind.config` any more. `inline` matters: it makes a
class emit `var(--ink)` itself, so an element that overrides a token (the
colophon's white tile) is honoured. Components carry no theme logic. Every text
colour clears WCAG AA, 4.5:1, on its background. Measured 2026-09-15:

| Token | Light | ratio | Dark | ratio | Used for |
|---|---|---|---|---|---|
| `ink` | `#16191C` | 16.9 | `#F5F7F8` | 17.3 | name, headings |
| `body` | `#2A3036` | 12.8 | `#E6E9EC` | 15.2 | paragraphs |
| `muted` | `#545C64` | 6.5 | `#C4CAD0` | 11.2 | tagline, project bodies, section headings |
| `faint` | `#606870` | 5.6 | `#AAB2B9` | 8.4 | dates, captions |
| `fainter` | `#6E767E` | 4.5 | `#98A1A8` | 6.6 | footer, metadata |

Before changing one, re-check the ratio (any online contrast checker, or the
three-line Python in the git history of this file's commit). The
institution logos get a light tile behind them in dark mode, since one is a
white-background PNG.

## Pages

| Route | Source | Notes |
|---|---|---|
| `/` | `app/page.tsx` | sections in `app/components/`, copy in `content/*.ts` |
| `/PhINODE` | `app/PhINODE/page.tsx` | the thesis project page; figures in `public/phinode/`, metadata in `content/phinode.ts` |
| `/colophon` | `app/colophon/page.tsx` | how the site runs; the diagram is `components/TunnelDiagram.tsx`. Public: stack, Pi and tunnel only, never ports, paths, hostnames or service names |

All three share the layout (header with theme toggle, footer with live stats
and, except on the colophon itself, a link to it).

## Static assets

`my-app/public/` is organised by kind:

| Folder | Contents |
|---|---|
| `docs/` | PDFs, each named as it should land in a downloads folder: `Titouan_Guerin_CV.pdf`, `Titouan_Guerin_Master_Thesis.pdf`, `..._Slides_EN.pdf`, `..._Slides_FR.pdf`. Replace a file in place to update it; links never change |
| `phinode/` | figures for the `/PhINODE` page, extracted from the thesis PDF and composited onto white |
| `logos/` | institution logos |

Nothing else belongs at the top level. Assets the old site used (photos, skill logos) were removed in the reorganisation and remain in git history and under the `v1-original` tag.

## Search engines and sharing

Generated at build, all from `my-app/app/`:

| Path | Source | What it is |
|---|---|---|
| `/robots.txt` | `robots.ts` | allows everything except `/api/`, points at the sitemap. Cloudflare prepends its own "content signals" comment block at the edge; the directives are ours |
| `/sitemap.xml` | `sitemap.ts` | `/`, `/PhINODE`, `/colophon`; `lastmod` = deploy time |
| `/icon` | `icon.tsx` | the favicon, a `#` on ink, 64px |
| `/opengraph-image` | `opengraph-image.tsx` | the 1200×630 card shown when the link is shared; built from `content/profile.ts` with the site's own fonts |
| JSON-LD in `<head>` | `components/StructuredData.tsx` | schema.org `Person` (affiliations, profiles, topics) and one `ScholarlyArticle` per entry in `content/publications.ts` |

Title, description, canonical URL and Open Graph tags are in `layout.tsx`.
