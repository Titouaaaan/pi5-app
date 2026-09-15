"""System stats API for the portfolio site.

Served by uvicorn under systemd (fastapi-backend.service) and reached only
through the Next.js /api/* rewrite on the same origin, so no CORS middleware
is needed or wanted here.
"""

import time

import psutil
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="pi5-app backend",
    description="Host statistics for titouanguerin.com",
    # Interactive docs are disabled: this API is reached only through the
    # site's own /api proxy and has no audience that needs to browse it.
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

MB = 1024.0 * 1024.0
GB = MB * 1024.0


class SystemStats(BaseModel):
    cpu: str
    memory: str
    disk: str
    uptime: str


class Health(BaseModel):
    status: str


def _format_uptime(seconds: float) -> str:
    days, remainder = divmod(int(seconds), 86400)
    hours = remainder // 3600
    if days:
        return f"{days}d {hours}h"
    minutes = (remainder % 3600) // 60
    return f"{hours}h {minutes}m"


@app.get("/health", response_model=Health)
async def health() -> Health:
    """Liveness probe for deploy.sh and uptime monitoring."""
    return Health(status="ok")


@app.get("/system-stats", response_model=SystemStats)
async def get_stats() -> SystemStats:
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    return SystemStats(
        cpu=f"{psutil.cpu_percent()}%",
        memory=f"{memory.available / MB:.0f}/{memory.total / MB:.0f}MB",
        disk=f"{disk.free / GB:.1f}/{disk.total / GB:.1f}GB",
        uptime=_format_uptime(time.time() - psutil.boot_time()),
    )
