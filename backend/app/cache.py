"""A tiny time-based cache for upstream data.

Every external source the backend talks to (GitHub, OpenAlex) is wrapped in
one of these: fetch at most once per TTL, serve the cached value otherwise,
and if a refresh fails keep serving the old value marked stale rather than
failing the request. Only the very first fetch can fail loudly.
"""

import threading
import time
from collections.abc import Callable
from typing import Generic, TypeVar

T = TypeVar("T")


class Cached(Generic[T]):
    def __init__(self, fetch: Callable[[], T], ttl: float) -> None:
        self._fetch = fetch
        self._ttl = ttl
        self._lock = threading.Lock()
        self._value: T | None = None
        self._at = 0.0

    def get(self) -> tuple[T, bool]:
        """Return (value, stale). Raises only if there is no value at all."""
        with self._lock:
            if self._value is not None and time.monotonic() - self._at < self._ttl:
                return self._value, False
            try:
                self._value = self._fetch()
                self._at = time.monotonic()
                return self._value, False
            except Exception:
                if self._value is None:
                    raise
                return self._value, True

    def clear(self) -> None:
        with self._lock:
            self._value = None
            self._at = 0.0
