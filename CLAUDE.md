# CLAUDE.md

Personal portfolio at **https://titouanguerin.com**, self-hosted on a Raspberry
Pi 5. Next.js 15 (App Router, Tailwind) in `my-app/`, a FastAPI backend in
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
   rolls back by itself. It has been exercised by a real failure and recovered.
3. **Dev server goes on port 3002.** 3000 is production, 3001 is uptime-kuma
   (answers with a misleading 302), 8000 is the live backend. Run a dev backend
   on 8001 and point the proxy at it: `BACKEND_URL=http://127.0.0.1:8001`.
4. **Do not leave extra directories inside `my-app/`.** `tsconfig.json`
   includes `**/*.ts`; a stray `node_modules.previous` once crawled into a
   production build and failed it. Scratch belongs in `<repo>/.deploy/`
   (gitignored) or outside the repo.
5. **Cloudflare is configured in the dashboard, not on disk.** The tunnel is
   token-mode. Titouan has asked not to change Cloudflare config; the routes are
   documented in `docs/OPERATIONS.md`.
6. **Do not publish personal data without asking.** The email link in
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
my-app/content/*.ts             all site copy: profile, phd, projects, timeline, skills
```

Content edits go in `my-app/content/`, not in components. Components are
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
.venv/bin/python -m pytest      # after: python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/pip-audit             # must report nothing; run inside the venv, not with -r

cd .. && ./deploy.sh   # add --backend when backend/ or deploy/ changed
```

## Where things stand

Redesign shipped 2026-09-15. The pre-redesign site is archived at tag
`v1-original` (not deployable with current tooling). Open work is tracked in
`docs/SECURITY.md` under "Still outstanding" — all of it needs changes to
systemd units or the Cloudflare dashboard, which is why it is still open.

Dependencies: Next is held on the 15.x line deliberately. `package.json` has an
`overrides` entry pinning Next's nested `postcss` to a patched release; keep it
until Next is upgraded to 16, at which point it can go. Next 16, Tailwind 4,
ESLint 10 and TypeScript 7 are all majors and each deserves its own change.
