"""The RL-BRAWL game: a Godot web export served as static files.

The game's own repo copies its export to ~/rl-brawl-web (replaced whole on
every export), so it is served from that folder rather than from Next.js
public/: a new export is live without a site rebuild. Next.js forwards
/rl-brawl/play/* here.

Next.js does not add its headers() to responses it proxies, so the game's
headers are set here. They differ from the site's in two places: WebAssembly
must be allowed to compile ('wasm-unsafe-eval'), and the game must be
framable by its own page (frame-ancestors 'self', which also stops other
sites embedding it on the Pi's bandwidth).
"""

import os
from pathlib import Path

from starlette.middleware.gzip import GZipMiddleware
from starlette.staticfiles import StaticFiles

HEADERS = {
    "Content-Security-Policy": "; ".join([
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",  # Godot makes some images in memory
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "object-src 'none'",
    ]),
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    # File names never change between exports: re-check every time; an
    # unchanged file costs a 304, not a download.
    "Cache-Control": "no-cache",
}


class GameFiles(StaticFiles):
    def file_response(self, *args, **kwargs):
        response = super().file_response(*args, **kwargs)
        response.headers.update(HEADERS)
        return response


# check_dir=False: the backend (and CI) start without the folder; the route
# just 404s. Gzip because Next.js only compresses some types: the 16 MB .pck
# (application/octet-stream) would otherwise go out raw.
game = GZipMiddleware(
    GameFiles(
        directory=os.environ.get("RL_BRAWL_DIR", Path.home() / "rl-brawl-web"),
        html=True,
        check_dir=False,
    ),
    compresslevel=6,
)
