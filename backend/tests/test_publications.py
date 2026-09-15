import httpx
import pytest
from fastapi.testclient import TestClient

from app import publications
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_cache():
    publications.cache.clear()
    yield
    publications.cache.clear()


def test_publications_shape(monkeypatch):
    class Resp:
        def raise_for_status(self): pass
        def json(self):
            return {"title": "Beyond Chatbots", "publication_year": 2024, "cited_by_count": 10}

    monkeypatch.setattr(httpx, "get", lambda *a, **k: Resp())
    body = client.get("/publications").json()
    paper = body["papers"][0]
    assert paper["doi"] == publications.DOIS[0]
    assert paper["citations"] == 10
    assert paper["source"] == "OpenAlex"
    assert paper["url"] == "https://doi.org/" + publications.DOIS[0]
    assert body["stale"] is False


def test_503_when_openalex_fails_with_no_cache(monkeypatch):
    def failing(*a, **k):
        raise httpx.ConnectError("down")

    monkeypatch.setattr(httpx, "get", failing)
    assert client.get("/publications").status_code == 503
