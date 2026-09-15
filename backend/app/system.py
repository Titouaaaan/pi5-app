"""Host statistics for the site footer, and the liveness probe."""

import time

import psutil
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

MB = 1024.0 * 1024.0
GB = MB * 1024.0


class Health(BaseModel):
    status: str


class SystemStats(BaseModel):
    cpu: str
    memory: str
    disk: str
    uptime: str


def format_uptime(seconds: float) -> str:
    days, remainder = divmod(int(seconds), 86400)
    hours = remainder // 3600
    if days:
        return f"{days}d {hours}h"
    minutes = (remainder % 3600) // 60
    return f"{hours}h {minutes}m"


@router.get("/health", response_model=Health)
def health() -> Health:
    return Health(status="ok")


@router.get("/system-stats", response_model=SystemStats)
def system_stats() -> SystemStats:
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    return SystemStats(
        cpu=f"{psutil.cpu_percent()}%",
        memory=f"{memory.available / MB:.0f}/{memory.total / MB:.0f}MB",
        disk=f"{disk.free / GB:.1f}/{disk.total / GB:.1f}GB",
        uptime=format_uptime(time.time() - psutil.boot_time()),
    )
