from datetime import date

import httpx
import pytest
from fastapi.testclient import TestClient

from app import cloudflare
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset():
    cloudflare.cache.clear()
    yield
    cloudflare.cache.clear()


def test_summarise_today_yesterday_and_sum():
    today = date(2026, 9, 16)
    by_day = {"2026-09-14": 213, "2026-09-15": 196, "2026-09-16": 100}
    v = cloudflare.summarise(by_day, today)
    assert (v.today, v.yesterday, v.last_30_days, v.source) == (100, 196, 509, "Cloudflare")


def test_missing_day_counts_as_zero():
    v = cloudflare.summarise({"2026-09-01": 5}, date(2026, 9, 16))
    assert (v.today, v.yesterday, v.last_30_days) == (0, 0, 5)


def test_503_without_token(monkeypatch):
    monkeypatch.delenv("CLOUDFLARE_API_TOKEN", raising=False)
    assert client.get("/visitors").status_code == 503


def test_503_when_cloudflare_fails(monkeypatch):
    monkeypatch.setenv("CLOUDFLARE_API_TOKEN", "x")

    def failing(*a, **k):
        raise httpx.ConnectError("down")

    monkeypatch.setattr(httpx, "get", failing)
    monkeypatch.setattr(httpx, "post", failing)
    assert client.get("/visitors").status_code == 503


def test_endpoint_shape(monkeypatch):
    monkeypatch.setattr(
        cloudflare.cache, "_fetch",
        lambda: cloudflare.summarise({"2026-09-16": 7}, date(2026, 9, 16)),
    )
    body = client.get("/visitors").json()
    assert set(body) == {"today", "yesterday", "last_30_days", "source", "stale"}
