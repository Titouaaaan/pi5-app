from fastapi import FastAPI
from pydantic import BaseModel
import psutil
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app instance
app = FastAPI()

# Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the structure of the system stats data
class SystemStats(BaseModel):
    cpu: str
    memory: str
    disk: str

# Function to get system stats
def get_system_stats():
    # CPU stats
    cpu = str(psutil.cpu_percent()) + '%'

    # Memory stats
    memory = psutil.virtual_memory()
    available = round(memory.available/1024.0/1024.0, 1)
    total = round(memory.total/1024.0/1024.0, 1)
    mem_info = f"{available}MB free / {total}MB total"

    # Disk stats
    disk = psutil.disk_usage('/')
    free = round(disk.free/1024.0/1024.0/1024.0, 1)
    total = round(disk.total/1024.0/1024.0/1024.0, 1)
    disk_info = f"{free}GB free / {total}GB total"

    return SystemStats(cpu=cpu, memory=mem_info, disk=disk_info)

# Endpoint to fetch system stats
@app.get("/system-stats", response_model=SystemStats)
async def get_stats():
    stats = get_system_stats()
    return stats
