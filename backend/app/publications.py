"""Citation counts for Titouan's papers, from OpenAlex.

OpenAlex is free and needs no key; a mailto in the user agent puts requests
in its polite pool. One request per paper per day.
"""

from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .cache import Cached

router = APIRouter()

DOIS = [
    "10.1007/978-3-031-77367-9_29",  # Beyond Chatbots, PRIMA 2024
]
TIMEOUT = 10.0
USER_AGENT = "titouanguerin.com (mailto:titouanguerin@gmail.com)"


class Paper(BaseModel):
    doi: str
    title: str
    year: int
    citations: int
    source: str = "OpenAlex"
    url: str


class Publications(BaseModel):
    papers: list[Paper]
    fetched_at: str
    stale: bool = False


def _fetch_one(doi: str) -> Paper:
    response = httpx.get(
        f"https://api.openalex.org/works/doi:{doi}",
        params={"select": "title,publication_year,cited_by_count"},
        headers={"User-Agent": USER_AGENT},
        timeout=TIMEOUT,
    )
    response.raise_for_status()
    data = response.json()
    return Paper(
        doi=doi,
        title=data["title"],
        year=data["publication_year"],
        citations=data["cited_by_count"],
        url=f"https://doi.org/{doi}",
    )


def _fetch() -> Publications:
    return Publications(
        papers=[_fetch_one(doi) for doi in DOIS],
        fetched_at=datetime.now(timezone.utc).isoformat(timespec="seconds"),
    )


cache = Cached(_fetch, ttl=86400)


@router.get("/publications", response_model=Publications)
def publications() -> Publications:
    try:
        value, stale = cache.get()
    except (httpx.HTTPError, KeyError, ValueError):
        raise HTTPException(status_code=503, detail="OpenAlex is unreachable")
    return value.model_copy(update={"stale": stale}) if stale else value
