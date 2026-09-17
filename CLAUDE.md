# CLAUDE.md

Personal portfolio at **https://titouanguerin.com**, self-hosted on a Raspberry
Pi 5. Next.js 16 (App Router, Tailwind) in `my-app/`, a FastAPI backend in
`backend/`, exposed through a Cloudflare tunnel.

Read `docs/OPERATIONS.md` before touching how the site runs, and
`docs/SECURITY.md` before touching anything network-facing. They are the source
of truth; this file is the short version.

## The rules that matter

1. **The live service runs from this repository's working tree**
   (`/home/titouan/home/pi/pi5-app/my-app`). Never run `npm run build` there by
   hand — `next start` reads `.next/` lazily and a half-finished build breaks
   the live site before any restart. Develop in a git worktree; deploy with
   `./deploy.sh`. Nothing else.
2. **`deploy.sh` refuses uncommitted or unpushed work.** Commit, push, then
   deploy. It builds into a scratch dir, swaps on success, health-checks and
   rolls back by itself, and a trap restores everything if it is interrupted.
   Run it as its own step, never chained after edits in one command: an
   interrupted chain once killed it mid-deploy.
3. **Dev server goes on port 3002.** 3000 is production, 3001 is uptime-kuma
   (answers with a misleading 302), 8000 is the live backend. Run a dev backend
   on 8001 and point the proxy at it: `BACKEND_URL=http://127.0.0.1:8001`.
4. **Do not leave extra directories inside `my-app/`.** `tsconfig.json`
   includes `**/*.ts`; a stray `node_modules.previous` once crawled into a
   production build and failed it. Scratch belongs in `<repo>/.deploy/`
   (gitignored) or outside the repo.
5. **Cloudflare is configured in the dashboard, not on disk.** The tunnel is
   token-mode, with the token in a root-only file. Dashboard changes are
   Titouan's to make, walked through step by step; the routes are documented
   in `docs/OPERATIONS.md`.
6. **The colophon page is public and describes the infrastructure.** Keep it to the stack, the Pi and the tunnel: never ports, paths, hostnames, service names, monitoring tools, network details or anything from docs/.
7. **Do not publish personal data without asking.** The email link in
   `content/profile.ts` is there because Titouan explicitly chose it.

## Layout

```
deploy.sh                       the only sanctioned way to ship
deploy/fastapi-backend.service  systemd unit, installed by deploy.sh --backend
docs/OPERATIONS.md              architecture, ports, deploy, rollback, tunnel routes
docs/SECURITY.md                what is hardened, what is still open
backend/app/                    FastAPI, one module per concern; main.py wires routers
backend/tests/                  pytest; run before every backend deploy
my-app/app/                     Next.js App Router: layout, page, components/
my-app/app/PhINODE/             the thesis project page; long-form JSX, metadata in content/phinode.ts
my-app/app/colophon/            how the site runs; prose is in the page, diagram in components/TunnelDiagram.tsx
my-app/content/*.ts             all site copy: profile, phd, projects, publications, timeline, skills, knowledge, phinode, languages (disabled)
my-app/public/docs/             PDFs, named as they should download (CV, thesis, slides)
my-app/public/phinode/          thesis figures, extracted from the report onto white
my-app/public/logos/            institution logos
my-app/app/robots.ts, sitemap.ts, opengraph-image.tsx   generated at build
```

Content edits go in `my-app/content/`, not in components; the two long-form pages (`PhINODE`, `colophon`) keep their prose in the page file. Titouan edits copy himself in the `/home/titouan/rework` worktree and asks for it to be shipped: commit his edits under his name only (no co-author line), then merge and deploy. Components are
server-rendered except `Projects.tsx` (expandable rows) and `PiStats.tsx`
(polls `/api/system-stats`). The footer's commit and deploy date are baked in at build time by `deploy.sh`, not fetched.

## Commands

```bash
cd my-app
npm run lint           # eslint . (flat config in eslint.config.mjs)
npx tsc --noEmit
npm run build
npm audit              # must report 0 vulnerabilities before deploying

cd ../backend
.venv/bin/python -m pytest      # after: python3 -m venv --upgrade-deps .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/pip-audit             # must report nothing; run inside the venv, not with -r

cd .. && ./deploy.sh   # add --backend when backend/ or deploy/ changed
```

The same checks run on GitHub (`.github/workflows/checks.yml`) on every push
and weekly; `gh run list` shows them. CI never deploys.

## Where things stand

Redesign shipped 2026-09-15; project page, colophon, Cloudflare visitor
counts, video embed, about/knowledge grid added 2026-09-16. On 2026-09-17 the
security list was worked through end to end (tunnel token rotated, backend
bound to localhost, `api.`/`pi.` retired, Node 22, CI, the major upgrades
below) and `v2.0.0` was tagged. The pre-redesign site is archived at tag
`v1-original` (not deployable with current tooling). The one item under
"Still outstanding" in `docs/SECURITY.md` needs the home Wi-Fi.

Open issues live on GitHub (`gh issue list`); the Pi is logged in as Titouaaaan.
The translate dropdown is disabled behind `TRANSLATE_ENABLED` pending issue #1.

Dependencies: Next **16.x**, Tailwind **4.x** (theme in `globals.css` under
`@theme inline`; no config file), ESLint **10** (via `@eslint/compat`) and
TypeScript **6.0**, all since 2026-09-17. TypeScript 7 waits on
`typescript-eslint`; see OPERATIONS.md for the checks before bumping either.
