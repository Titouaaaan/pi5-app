"""Backend for titouanguerin.com.

Runs under systemd (deploy/fastapi-backend.service) and is reached by the
browser only through the Next.js /api/* rewrite on the same origin, so there
is no CORS middleware here and none is wanted.
"""

from fastapi import FastAPI

from . import deploy, github, publications, system, visits

app = FastAPI(
    title="titouanguerin.com backend",
    # Interactive docs are disabled: this API has no audience that needs to
    # browse it, and the schema would only advertise the surface.
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.include_router(system.router)
app.include_router(deploy.router)
app.include_router(github.router)
app.include_router(publications.router)
app.include_router(visits.router)
