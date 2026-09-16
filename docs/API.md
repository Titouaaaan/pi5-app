# Backend API

FastAPI service in `backend/app/`, one module per endpoint group. The browser
reaches it only through the Next.js rewrite, so every path below is public at
`https://titouanguerin.com/api/<path>`; on the Pi itself it listens on
`127.0.0.1:8000/<path>`. No authentication, no cookies, no CORS headers
(same-origin by construction). Interactive docs are deliberately disabled.

Errors follow FastAPI's default shape: `{"detail": "<message>"}` with the
matching status code.

Environment (set in `deploy/fastapi-backend.service`):

| Variable | Purpose | Default |
|---|---|---|
| `DEPLOY_INFO_PATH` | file written by `deploy.sh`, read by `/deploy` | unset (endpoint returns nulls) |
| `DATA_DIR` | SQLite database and secret for `/visit` | `.data` relative to the working directory |
| `GITHUB_TOKEN` | raises the GitHub quota for `/github/activity` | unset (unauthenticated, 60 req/h, plenty) |
| `CLOUDFLARE_API_TOKEN` | read-only token (Zone > Analytics > Read) for `/visitors` | unset (endpoint returns 503) |

Secrets live in `/etc/pi5-app/backend.env` (root, mode 600), loaded by the
unit's `EnvironmentFile=`; never in the repo.

Anything that calls an outside service goes through `backend/app/cache.py`:
fetch at most once per TTL, serve the cached value otherwise, and if a refresh
fails serve the previous value with `"stale": true` rather than fail. Only a
request that arrives before the first successful fetch can get a 503.

---

## `GET /health`

Liveness probe. Used by `deploy.sh` and suitable for uptime-kuma.

```json
{"status": "ok"}
```

Module `system.py`. No cache, no upstream.

## `GET /system-stats`

Host statistics for the footer. Polled every 30 s by `PiStats.tsx`.

```json
{"cpu": "1.9%", "memory": "5953/8063MB", "disk": "48.4/58.0GB", "uptime": "76d 21h"}
```

| Field | Meaning |
|---|---|
| `cpu` | `psutil.cpu_percent()` since the previous call, one decimal |
| `memory` | available / total, MiB, integers |
| `disk` | free / total of `/`, GiB, one decimal |
| `uptime` | since boot, `Nd Nh` past a day, else `Nh Nm` |

Module `system.py`. No cache, read live on every call.

## `GET /deploy`

What is currently deployed. `deploy.sh` writes the file before building and,
after restarting, calls this to confirm the running backend reports the commit
it just shipped.

```json
{"commit": "a56b79d", "deployed_at": "2026-09-15T16:28:21Z"}
```

Both fields are `null` if `DEPLOY_INFO_PATH` is unset, missing, or not JSON.
Module `deploy.py`. No cache; the file is read on every call.

## `GET /github/activity`

Last push and star count for every public, non-fork repository of the
GitHub account. Loaded once by `Projects.tsx`, which matches repositories by
name from each project's GitHub link; a linked repository absent from this
list is shown as "repository currently private".

```json
{
  "repos": {
    "RL-Souls": {"pushed_at": "2025-06-05T13:07:41Z", "stars": 1, "url": "https://github.com/Titouaaaan/RL-Souls"},
    "ELL-MMA":  {"pushed_at": "2024-09-18T09:12:03Z", "stars": 3, "url": "https://github.com/Titouaaaan/ELL-MMA"}
  },
  "fetched_at": "2026-09-15T15:44:02+00:00",
  "stale": false
}
```

Upstream: one request to `https://api.github.com/users/Titouaaaan/repos`
(`per_page=100`, `type=owner`). Cache TTL **1 hour**. `503 {"detail": "GitHub
is unreachable"}` only if nothing has ever been fetched. Module `github.py`.

## `GET /publications`

Citation counts for the DOIs listed in `backend/app/publications.py`. Loaded
once by `Publications.tsx`.

```json
{
  "papers": [
    {
      "doi": "10.1007/978-3-031-77367-9_29",
      "title": "Beyond Chatbots: Enhancing Luxembourgish Language Learning Through Multi-agent Systems and Large Language Model",
      "year": 2024,
      "citations": 10,
      "source": "OpenAlex",
      "url": "https://doi.org/10.1007/978-3-031-77367-9_29"
    }
  ],
  "fetched_at": "2026-09-15T15:47:16+00:00",
  "stale": false
}
```

Upstream: `https://api.openalex.org/works/doi:<doi>` per paper, polite pool
via a `mailto` in the user agent. Cache TTL **24 hours**. `503 {"detail":
"OpenAlex is unreachable"}` only if nothing has ever been fetched. Module
`publications.py`. To add a paper, append its DOI to `DOIS` and its entry to
`my-app/content/publications.ts`.

## `POST /visit`

Records one visit and returns unique-visitor counts. Called once on page
load by `Visits.tsx`.

```json
{"today": 4, "last_30_days": 61, "all_time": 61}
```

What is stored: `sha256(secret + day + ip)[:16]` under a `(day, visitor)`
primary key, so a repeat visit the same day is a no-op. The client address is
taken from `CF-Connecting-IP`, then `X-Forwarded-For` (first hop), then
`X-Real-IP`, then the socket peer; the Cloudflare header is verified to
survive the Next.js rewrite. The secret is 32 random bytes generated on first
run at `DATA_DIR/visits.secret`, mode 600. Nothing stored can identify a
visitor or link two days. Module `visits.py`.

## `GET /visitors`

Unique visitors as Cloudflare counts them. Shown in the footer.

```json
{"today": 100, "yesterday": 196, "last_30_days": 5822, "source": "Cloudflare", "stale": false}
```

Cloudflare's "unique visitor" is every distinct IP that made any request to
the zone, on any hostname: crawlers, scanners, uptime checks and the dead
`pi.` record all count. The API exposes uniques only per day, so
`last_30_days` is the **sum of daily uniques** (31 calendar days including
today), not a distinct count over the period; the dashboard's multi-day
figure is computed differently and will be lower. Upstream: Cloudflare
GraphQL, `httpRequests1dGroups`, one query per hour, cached, stale on
failure. `503` if the token is missing or nothing was ever fetched. Module
`cloudflare.py`.

For comparison, `/visits` below counts only browsers that ran the page:
in the first 24 hours both existed, Cloudflare reported ~300/day and this
site's counter ~15, i.e. roughly 95% of Cloudflare's figure is machines.

## `GET /visits`

The same counts without recording anything.

```json
{"today": 4, "last_30_days": 61, "all_time": 61}
```

---

## Adding an endpoint

1. New module in `backend/app/`, an `APIRouter`, pydantic models for the
   response.
2. If it calls anything outside the Pi, wrap the fetch in `Cached(fetch, ttl)`
   and map the fetch's exceptions to a 503 as `github.py` does.
3. Include the router in `main.py`.
4. Tests in `backend/tests/`; run `pytest` and `pip-audit` inside the venv.
5. Document it here. Deploy with `./deploy.sh --backend`.
