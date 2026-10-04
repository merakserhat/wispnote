from __future__ import annotations

from typing import Any

from ..utils import normalize_whitespace

OBJECT_REPLACEMENT = "￼"


def selection(ax: Any, element: Any) -> str | None:
    marker_range = ax.raw_attribute(element, "AXSelectedTextMarkerRange")
    if marker_range is None:
        return None

    text = ax.parameterized(element, "AXStringForTextMarkerRange", marker_range)
    if text is None:
        return None
    text = str(text)
    return text if text.strip() else None


def document(ax: Any, element: Any) -> str | None:
    start = ax.raw_attribute(element, "AXStartTextMarker")
    end = ax.raw_attribute(element, "AXEndTextMarker")
    if start is None or end is None:
        return None

    full_range = ax.parameterized(element, "AXTextMarkerRangeForUnorderedTextMarkers", [start, end])
    text = ax.parameterized(element, "AXStringForTextMarkerRange", full_range)
    if text is None:
        return None
    text = str(text)
    return text if text.strip() else None


def slice_around(text: str, selected: str, needle_chars: int = 120) -> tuple[str, str] | None:
    if not text or not selected.strip():
        return None

    position = text.find(selected[:needle_chars])
    if position < 0:
        return None
    return text[:position], text[position + len(selected) :]


def as_prose(text: str) -> str:
    return normalize_whitespace(text.replace(OBJECT_REPLACEMENT, " "))
