import json

from fastapi.testclient import TestClient

from app.deploy import read_deploy_info
from app.main import app
from app.system import format_uptime

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_system_stats_shape():
    body = client.get("/system-stats").json()
    assert set(body) == {"cpu", "memory", "disk", "uptime"}
    assert body["cpu"].endswith("%")
    assert body["memory"].endswith("MB")
    assert body["disk"].endswith("GB")


def test_docs_are_disabled():
    for path in ("/docs", "/redoc", "/openapi.json"):
        assert client.get(path).status_code == 404


def test_no_cors_header():
    response = client.get("/system-stats", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in response.headers


def test_format_uptime():
    assert format_uptime(90) == "0h 1m"
    assert format_uptime(3600 * 5 + 60 * 7) == "5h 7m"
    assert format_uptime(86400 * 3 + 3600 * 2) == "3d 2h"


def test_deploy_info_missing_file(monkeypatch):
    monkeypatch.setenv("DEPLOY_INFO_PATH", "/nonexistent/info.json")
    assert client.get("/deploy").json() == {"commit": None, "deployed_at": None}


def test_deploy_info_reads_file(tmp_path, monkeypatch):
    path = tmp_path / "info.json"
    path.write_text(json.dumps({"commit": "abc1234", "deployed_at": "2026-09-15T16:00:00Z"}))
    monkeypatch.setenv("DEPLOY_INFO_PATH", str(path))
    assert client.get("/deploy").json() == {
        "commit": "abc1234",
        "deployed_at": "2026-09-15T16:00:00Z",
    }


def test_deploy_info_bad_json(tmp_path):
    path = tmp_path / "info.json"
    path.write_text("not json")
    assert read_deploy_info(str(path)).commit is None



def test_rl_brawl_game_files(tmp_path, monkeypatch):
    from app import rlbrawl

    (tmp_path / "index.html").write_text("<canvas></canvas>")
    (tmp_path / "game.wasm").write_bytes(b"\0asm" * 1000)
    monkeypatch.setattr(rlbrawl.game.app, "directory", str(tmp_path))
    monkeypatch.setattr(rlbrawl.game.app, "all_directories", [str(tmp_path)])
    page = client.get("/rl-brawl/play/index.html")
    assert page.text == "<canvas></canvas>"
    assert "'wasm-unsafe-eval'" in page.headers["content-security-policy"]
    assert page.headers["x-frame-options"] == "SAMEORIGIN"
    assert page.headers["cache-control"] == "no-cache"
    wasm = client.get("/rl-brawl/play/game.wasm", headers={"Accept-Encoding": "gzip"})
    assert wasm.headers["content-type"] == "application/wasm"
    assert wasm.headers["content-encoding"] == "gzip"
    assert client.get("/rl-brawl/play/../main.py").status_code == 404

    # No export yet: a 404, not a 500.
    missing = str(tmp_path / "missing")
    monkeypatch.setattr(rlbrawl.game.app, "directory", missing)
    monkeypatch.setattr(rlbrawl.game.app, "all_directories", [missing])
    assert client.get("/rl-brawl/play/index.html").status_code == 404
