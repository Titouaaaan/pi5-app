"""Recent activity on Titouan's GitHub repositories.

One request to the GitHub API fetches every public repository of the account
with its last push date and star count, cached for an hour. GITHUB_TOKEN
raises the quota if ever needed; nothing here requires it.
"""

import os
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .cache import Cached

router = APIRouter()

OWNER = "Titouaaaan"
TIMEOUT = 10.0


class RepoActivity(BaseModel):
    pushed_at: str
    stars: int
    url: str


class Activity(BaseModel):
    repos: dict[str, RepoActivity]
    fetched_at: str
    stale: bool = False


def _fetch() -> Activity:
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

    return Activity(
        repos={
            repo["name"]: RepoActivity(
                pushed_at=repo["pushed_at"],
                stars=repo["stargazers_count"],
                url=repo["html_url"],
            )
            for repo in response.json()
            if not repo.get("fork")
        },
        fetched_at=datetime.now(timezone.utc).isoformat(timespec="seconds"),
    )


cache = Cached(_fetch, ttl=3600)


@router.get("/github/activity", response_model=Activity)
def github_activity() -> Activity:
    try:
        value, stale = cache.get()
    except (httpx.HTTPError, KeyError, ValueError):
        raise HTTPException(status_code=503, detail="GitHub is unreachable")
    return value.model_copy(update={"stale": stale}) if stale else value
