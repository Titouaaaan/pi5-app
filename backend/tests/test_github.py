import httpx
import pytest
from fastapi.testclient import TestClient

from app import github
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_cache():
    github.cache.clear()
    yield
    github.cache.clear()


def fake_activity():
    return github.Activity(
        repos={
            "RL-Souls": github.RepoActivity(
                pushed_at="2026-09-01T10:00:00Z", stars=3, url="https://github.com/Titouaaaan/RL-Souls"
            )
        },
        fetched_at="2026-09-15T00:00:00+00:00",
    )


def test_activity_returns_repos(monkeypatch):
    monkeypatch.setattr(github.cache, "_fetch", fake_activity)
    body = client.get("/github/activity").json()
    assert body["repos"]["RL-Souls"]["stars"] == 3
    assert body["stale"] is False


def test_serves_stale_when_github_fails(monkeypatch):
    monkeypatch.setattr(github.cache, "_fetch", fake_activity)
    client.get("/github/activity")
    github.cache._at = 0.0  # expire

    def failing():
        raise httpx.ConnectError("down")

    monkeypatch.setattr(github.cache, "_fetch", failing)
    body = client.get("/github/activity").json()
    assert body["stale"] is True
    assert "RL-Souls" in body["repos"]


def test_503_when_github_fails_with_no_cache(monkeypatch):
    def failing():
        raise httpx.ConnectError("down")

    monkeypatch.setattr(github.cache, "_fetch", failing)
    assert client.get("/github/activity").status_code == 503


def test_forks_are_dropped(monkeypatch):
    class Resp:
        def raise_for_status(self): pass
        def json(self):
            return [
                {"name": "mine", "pushed_at": "2026-01-01T00:00:00Z", "stargazers_count": 1, "html_url": "u", "fork": False},
                {"name": "theirs", "pushed_at": "2026-01-01T00:00:00Z", "stargazers_count": 9, "html_url": "u", "fork": True},
            ]

    monkeypatch.setattr(httpx, "get", lambda *a, **k: Resp())
    assert set(github._fetch().repos) == {"mine"}
