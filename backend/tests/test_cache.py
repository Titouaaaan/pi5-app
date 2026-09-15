import pytest

from app.cache import Cached


def test_fetches_once_within_ttl():
    calls = []
    c = Cached(lambda: calls.append(1) or "v", ttl=60)
    assert c.get() == ("v", False)
    assert c.get() == ("v", False)
    assert len(calls) == 1


def test_serves_stale_on_refresh_failure():
    state = {"fail": False}

    def fetch():
        if state["fail"]:
            raise RuntimeError("down")
        return "v"

    c = Cached(fetch, ttl=0)  # always expired
    assert c.get() == ("v", False)
    state["fail"] = True
    assert c.get() == ("v", True)


def test_raises_when_nothing_cached():
    def fetch():
        raise RuntimeError("down")

    with pytest.raises(RuntimeError):
        Cached(fetch, ttl=60).get()
