import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def data_dir(tmp_path, monkeypatch):
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    yield tmp_path


def test_same_ip_counts_once():
    a = client.post("/visit", headers={"cf-connecting-ip": "1.2.3.4"}).json()
    b = client.post("/visit", headers={"cf-connecting-ip": "1.2.3.4"}).json()
    assert a["today"] == 1 and b["today"] == 1


def test_different_ips_count_separately():
    client.post("/visit", headers={"cf-connecting-ip": "1.2.3.4"})
    body = client.post("/visit", headers={"cf-connecting-ip": "5.6.7.8"}).json()
    assert body["today"] == 2 and body["last_30_days"] == 2 and body["all_time"] == 2


def test_header_precedence_cloudflare_first():
    client.post("/visit", headers={"cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "9.9.9.9, 8.8.8.8"})
    body = client.post("/visit", headers={"cf-connecting-ip": "1.1.1.1"}).json()
    assert body["today"] == 1


def test_forwarded_for_takes_first_hop():
    client.post("/visit", headers={"x-forwarded-for": "9.9.9.9, 8.8.8.8"})
    body = client.post("/visit", headers={"x-forwarded-for": "9.9.9.9"}).json()
    assert body["today"] == 1


def test_nothing_identifying_is_stored(data_dir):
    client.post("/visit", headers={"cf-connecting-ip": "203.0.113.7"})
    raw = (data_dir / "visits.db").read_bytes()
    assert b"203.0.113.7" not in raw


def test_secret_is_private(data_dir):
    client.post("/visit")
    assert oct((data_dir / "visits.secret").stat().st_mode & 0o777) == "0o600"


def test_get_visits_does_not_record():
    client.post("/visit", headers={"cf-connecting-ip": "1.2.3.4"})
    body = client.get("/visits").json()
    assert body == {"today": 1, "last_30_days": 1, "all_time": 1}
