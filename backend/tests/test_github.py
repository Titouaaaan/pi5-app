import httpx
import pytest
from fastapi.testclient import TestClient

from app import github
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_cache():
    github._cache = None
    github._cached_at = 0.0
    yield
    github._cache = None
    github._cached_at = 0.0


def fake_repos():
    return {
        "RL-Souls": github.RepoActivity(
            pushed_at="2026-09-01T10:00:00Z", stars=3, url="https://github.com/Titouaaaan/RL-Souls"
        )
    }


def test_activity_returns_repos(monkeypatch):
    monkeypatch.setattr(github, "_fetch_repos", fake_repos)
    body = client.get("/github/activity").json()
    assert body["repos"]["RL-Souls"]["stars"] == 3
    assert body["stale"] is False
    assert body["fetched_at"]


def test_activity_is_cached(monkeypatch):
    calls = []

    def counting():
        calls.append(1)
        return fake_repos()

    monkeypatch.setattr(github, "_fetch_repos", counting)
    client.get("/github/activity")
    client.get("/github/activity")
    assert len(calls) == 1


def test_serves_stale_when_github_fails(monkeypatch):
    monkeypatch.setattr(github, "_fetch_repos", fake_repos)
    client.get("/github/activity")
    github._cached_at = 0.0  # expire

    def failing():
        raise httpx.ConnectError("down")

    monkeypatch.setattr(github, "_fetch_repos", failing)
    body = client.get("/github/activity").json()
    assert body["stale"] is True
    assert "RL-Souls" in body["repos"]


def test_503_when_github_fails_with_no_cache(monkeypatch):
    def failing():
        raise httpx.ConnectError("down")

    monkeypatch.setattr(github, "_fetch_repos", failing)
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
    repos = github._fetch_repos()
    assert set(repos) == {"mine"}
