# Personal Portfolio Website

My personal portfolio — projects, education and work experience. Built as a
side project to experiment with modern web technologies and to have a personal
space to share my work.

**Live at [titouanguerin.com](https://titouanguerin.com)**, served from a
Raspberry Pi 5 sitting in my flat.

## Stack

**Frontend** — [Next.js](https://nextjs.org) 16 (App Router), React 19,
TypeScript and Tailwind CSS. Server-rendered, with client-side JavaScript only
where something actually needs to be interactive.

**Backend** — Python and [FastAPI](https://fastapi.tiangolo.com). Very based.
It reports the Pi's live CPU, memory, disk and uptime, which you can see at the
bottom of the page.

## Hosting

Everything runs on a **Raspberry Pi 5** (8GB). Three systemd services keep it
alive: the Next.js app, the FastAPI backend, and `cloudflared`.

A **Cloudflare Tunnel** exposes the Pi to the internet without opening a single
port on my router. It acts as a reverse proxy, holding an encrypted connection
out to Cloudflare's network, which means the Pi's real IP address is never
exposed and there are no router rules or static IPs to deal with. All it costs
is owning a domain name. Hosting this way is cheap, uses almost no power, and I
get to play with a new toy — always fun.

For the full picture — architecture, ports, deploying, rolling back — see
[docs/OPERATIONS.md](docs/OPERATIONS.md).

## Running it locally

```bash
cd my-app
npm install

# frontend
BACKEND_URL=http://127.0.0.1:8001 npm run dev -- -p 3002

# backend, in another shell
cd ../backend
python3 -m venv --upgrade-deps .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn app.main:app --port 8001 --reload
.venv/bin/python -m pytest        # tests
```

## Deploying

```bash
./deploy.sh
```

It refuses to deploy anything uncommitted or unpushed, builds into a scratch
directory and only swaps it in once the build succeeds, then health-checks the
site and rolls back on its own if something went wrong. Full detail in
[docs/OPERATIONS.md](docs/OPERATIONS.md).

## Notes

- **Security** — what has been hardened and what is still outstanding is
  tracked in [docs/SECURITY.md](docs/SECURITY.md).
- **The old design** is permanently archived at the `v1-original` tag, if you
  ever want to see what this looked like before.
- **Open Source** — also very based.

Feel free to explore the codebase, and don't hesitate to reach out if you see
any issues <3
