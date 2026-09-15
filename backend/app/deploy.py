"""What is currently deployed.

deploy.sh writes a small JSON file at DEPLOY_INFO_PATH before it builds, and
after restarting it checks that this endpoint reports the commit it just
shipped. That closes the loop: the deploy is only called healthy once the
running backend says it is the new one.
"""

import json
import os
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DeployInfo(BaseModel):
    commit: str | None = None
    deployed_at: str | None = None


def read_deploy_info(path: str | None = None) -> DeployInfo:
    path = path or os.environ.get("DEPLOY_INFO_PATH")
    if not path:
        return DeployInfo()
    try:
        data = json.loads(Path(path).read_text())
    except (OSError, ValueError):
        return DeployInfo()
    return DeployInfo(commit=data.get("commit"), deployed_at=data.get("deployed_at"))


@router.get("/deploy", response_model=DeployInfo)
def deploy_info() -> DeployInfo:
    return read_deploy_info()
