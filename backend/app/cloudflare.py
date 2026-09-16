"""Unique visitors as Cloudflare counts them, via its GraphQL analytics API.

Cloudflare's figure is every distinct IP that made any request to the zone,
bots and scanners included; it is the number the dashboard shows. The API
only exposes uniques per day, so "last 30 days" is the sum of daily uniques,
which is also how the dashboard's daily bars add up. Needs a read-only
token (Zone > Analytics > Read) in CLOUDFLARE_API_TOKEN; never in the repo.
"""

import os
from datetime import date, timedelta

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .cache import Cached

router = APIRouter()

ZONE_NAME = "titouanguerin.com"
API = "https://api.cloudflare.com/client/v4"
TIMEOUT = 15.0

QUERY = """
query($zone: String!, $since: String!, $until: String!) {
  viewer { zones(filter: {zoneTag: $zone}) {
    httpRequests1dGroups(limit: 32, filter: {date_geq: $since, date_leq: $until}, orderBy: [date_ASC]) {
      dimensions { date }
      uniq { uniques }
    }
  } }
}
"""


class Visitors(BaseModel):
    today: int
    yesterday: int
    last_30_days: int
    source: str = "Cloudflare"
    stale: bool = False


def _headers() -> dict[str, str]:
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    if not token:
        raise RuntimeError("CLOUDFLARE_API_TOKEN is not set")
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


_zone_id: str | None = None


def _zone() -> str:
    global _zone_id
    if _zone_id is None:
        r = httpx.get(f"{API}/zones", params={"name": ZONE_NAME}, headers=_headers(), timeout=TIMEOUT)
        r.raise_for_status()
        _zone_id = r.json()["result"][0]["id"]
    return _zone_id


def daily_uniques(today: date | None = None) -> dict[str, int]:
    today = today or date.today()
    r = httpx.post(
        f"{API}/graphql",
        json={
            "query": QUERY,
            "variables": {
                "zone": _zone(),
                "since": (today - timedelta(days=30)).isoformat(),
                "until": today.isoformat(),
            },
        },
        headers=_headers(),
        timeout=TIMEOUT,
    )
    r.raise_for_status()
    body = r.json()
    if body.get("errors"):
        raise RuntimeError(body["errors"][0].get("message", "GraphQL error"))
    rows = body["data"]["viewer"]["zones"][0]["httpRequests1dGroups"]
    return {row["dimensions"]["date"]: row["uniq"]["uniques"] for row in rows}


def summarise(by_day: dict[str, int], today: date | None = None) -> Visitors:
    today = today or date.today()
    yesterday = today - timedelta(days=1)
    return Visitors(
        today=by_day.get(today.isoformat(), 0),
        yesterday=by_day.get(yesterday.isoformat(), 0),
        last_30_days=sum(by_day.values()),
    )


def _fetch() -> Visitors:
    return summarise(daily_uniques())


cache = Cached(_fetch, ttl=3600)


@router.get("/visitors", response_model=Visitors)
def visitors() -> Visitors:
    try:
        value, stale = cache.get()
    except (httpx.HTTPError, RuntimeError, KeyError, IndexError, ValueError):
        raise HTTPException(status_code=503, detail="Cloudflare analytics unavailable")
    return value.model_copy(update={"stale": stale}) if stale else value
