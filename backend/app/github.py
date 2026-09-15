"""Recent activity on Titouan's GitHub repositories.

One request to the GitHub API fetches every public repository of the account
with its last push date and star count. The result is cached for an hour and
served stale if GitHub is unreachable, so the site never depends on GitHub
being up and never spends more than one request per hour of its quota.
GITHUB_TOKEN raises the quota if ever needed; nothing here requires it.
"""

import os
import threading
import time
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

OWNER = "Titouaaaan"
CACHE_TTL = 3600.0
TIMEOUT = 10.0


class RepoActivity(BaseModel):
    pushed_at: str
    stars: int
    url: str


class Activity(BaseModel):
    repos: dict[str, RepoActivity]
    fetched_at: str
    stale: bool = False


def _fetch_repos() -> dict[str, RepoActivity]:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "titouanguerin.com"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    response = httpx.get(
        f"https://api.github.com/users/{OWNER}/repos",
        params={"per_page": 100, "type": "owner", "sort": "pushed"},
        headers=headers,
        timeout=TIMEOUT,
    )
    response.raise_for_status()

    return {
        repo["name"]: RepoActivity(
            pushed_at=repo["pushed_at"],
            stars=repo["stargazers_count"],
            url=repo["html_url"],
        )
        for repo in response.json()
        if not repo.get("fork")
    }


_lock = threading.Lock()
_cache: Activity | None = None
_cached_at = 0.0


def get_activity() -> Activity:
    global _cache, _cached_at

    with _lock:
        if _cache is not None and time.monotonic() - _cached_at < CACHE_TTL:
            return _cache

        try:
            repos = _fetch_repos()
        except (httpx.HTTPError, KeyError, ValueError):
            if _cache is None:
                raise HTTPException(status_code=503, detail="GitHub is unreachable")
            return _cache.model_copy(update={"stale": True})

        _cache = Activity(
            repos=repos,
            fetched_at=datetime.now(timezone.utc).isoformat(timespec="seconds"),
        )
        _cached_at = time.monotonic()
        return _cache


@router.get("/github/activity", response_model=Activity)
def github_activity() -> Activity:
    return get_activity()
