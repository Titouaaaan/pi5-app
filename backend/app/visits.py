"""A visitor counter that cannot track anyone.

Each visit is recorded as sha256(ip + day + secret): the daily component
means one person on two different days produces two unrelated hashes, so
there is nothing to join across days, and the secret (generated once on the
Pi, never committed) means the hash cannot be reversed from the IP space by
anyone who reads the database. No cookies, no raw addresses stored.

Counts are unique visitors per day. The page fires one POST from JavaScript
on load; reloads collapse server-side, and crawlers that do not run
JavaScript are not counted.
"""

import hashlib
import os
import secrets
import sqlite3
from datetime import date, timedelta
from pathlib import Path

from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter()


class Visits(BaseModel):
    today: int
    last_30_days: int
    all_time: int


def data_dir() -> Path:
    path = Path(os.environ.get("DATA_DIR", ".data"))
    path.mkdir(parents=True, exist_ok=True)
    return path


def _secret() -> bytes:
    path = data_dir() / "visits.secret"
    if not path.exists():
        path.write_bytes(secrets.token_bytes(32))
        path.chmod(0o600)
    return path.read_bytes()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(data_dir() / "visits.db")
    conn.execute(
        "CREATE TABLE IF NOT EXISTS visits (day TEXT NOT NULL, visitor TEXT NOT NULL, PRIMARY KEY (day, visitor))"
    )
    return conn


def client_ip(request: Request) -> str:
    """The address Cloudflare saw, if the header survived the hops; else the peer."""
    for header in ("cf-connecting-ip", "x-forwarded-for", "x-real-ip"):
        value = request.headers.get(header)
        if value:
            return value.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def visitor_hash(ip: str, day: str) -> str:
    return hashlib.sha256(_secret() + day.encode() + ip.encode()).hexdigest()[:16]


def counts(conn: sqlite3.Connection, today: date) -> Visits:
    cutoff = (today - timedelta(days=30)).isoformat()
    (today_n,) = conn.execute("SELECT COUNT(*) FROM visits WHERE day = ?", (today.isoformat(),)).fetchone()
    (month_n,) = conn.execute("SELECT COUNT(*) FROM visits WHERE day > ?", (cutoff,)).fetchone()
    (all_n,) = conn.execute("SELECT COUNT(*) FROM visits").fetchone()
    return Visits(today=today_n, last_30_days=month_n, all_time=all_n)


@router.post("/visit", response_model=Visits)
def record_visit(request: Request) -> Visits:
    today = date.today()
    with _connect() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO visits (day, visitor) VALUES (?, ?)",
            (today.isoformat(), visitor_hash(client_ip(request), today.isoformat())),
        )
        return counts(conn, today)


@router.get("/visits", response_model=Visits)
def get_visits() -> Visits:
    with _connect() as conn:
        return counts(conn, date.today())
