from __future__ import annotations

import datetime
import hashlib
import re
import unicodedata
from pathlib import Path
from urllib.parse import parse_qsl, unquote, urlencode, urlparse, urlunparse

_TRACKING_PARAMS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "mc_cid",
    "mc_eid",
    "ref",
    "source",
    "_ga",
    "igshid",
}

_WHITESPACE_RE = re.compile(r"\s+")
_SOFT_HYPHEN = "­"


def now_iso() -> str:
    return datetime.datetime.now().isoformat(timespec="seconds")


def normalize_whitespace(text: str | None) -> str:
    if not text:
        return ""
    cleaned = unicodedata.normalize("NFKC", text).replace(_SOFT_HYPHEN, "")
    return _WHITESPACE_RE.sub(" ", cleaned).strip()


def truncate(text: str | None, limit: int, suffix: str = "…") -> str:
    if not text:
        return ""
    if limit <= 0 or len(text) <= limit:
        return text
    return text[: max(0, limit - len(suffix))] + suffix


def normalize_url(url: str | None) -> str:
    if not url:
        return ""
    try:
        parts = urlparse(url.strip())
    except ValueError:
        return url.strip()

    if not parts.scheme:
        return url.strip()

    netloc = parts.netloc.lower()
    if netloc.endswith(":80") and parts.scheme == "http":
        netloc = netloc[:-3]
    if netloc.endswith(":443") and parts.scheme == "https":
        netloc = netloc[:-4]

    query = urlencode(
        [
            (key, value)
            for key, value in parse_qsl(parts.query, keep_blank_values=True)
            if key.lower() not in _TRACKING_PARAMS
        ]
    )

    path = parts.path or "/"
    if len(path) > 1 and path.endswith("/"):
        path = path.rstrip("/")

    return urlunparse((parts.scheme.lower(), netloc, path, "", query, ""))


def url_host(url: str | None) -> str:
    if not url:
        return ""
    try:
        return urlparse(url).netloc.lower()
    except ValueError:
        return ""


def file_url_to_path(value: str | None) -> str | None:
    if not value:
        return None
    value = str(value)
    if value.startswith("file://"):
        return unquote(urlparse(value).path) or None
    if value.startswith("/"):
        return value
    if value.startswith("~"):
        return str(Path(value).expanduser())
    return None


def stable_hash(*parts: object, length: int = 16) -> str:
    digest = hashlib.sha256("\x1f".join(str(part) for part in parts).encode("utf-8"))
    return digest.hexdigest()[:length]


def clean_window_title(title: str | None, app_name: str | None = None) -> str:
    if not title:
        return ""
    text = normalize_whitespace(title)
    if app_name:
        for separator in (" - ", " — ", " – ", " | "):
            marker = f"{separator}{app_name}"
            index = text.find(marker)
            if index > 0:
                text = text[:index]
                break
    return text.strip(" -—–|")
