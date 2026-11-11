from __future__ import annotations

from collections.abc import Callable, Iterator
from typing import Any

from ..config import Settings
from . import clipboard, text_markers
from .ax_client import AXClient
from .extractors import ElementBundle

WEB_AREA_ROLE = "AXWebArea"
PARENT_HOPS = 40
SEARCH_MAX_DEPTH = 12
SEARCH_MAX_NODES = 250
SEARCH_TIME_BUDGET = 0.4

Scope = Iterator[tuple[Any, int]] | None
Strategy = Callable[[AXClient, ElementBundle, Settings, Scope], str | None]


def read_selection(
    ax: AXClient, elements: ElementBundle, settings: Settings, scope: Scope = None
) -> tuple[str, str] | None:
    for name, strategy in STRATEGIES:
        try:
            text = strategy(ax, elements, settings, scope)
        except Exception:
            continue
        if text:
            return text, name
    return None


def _focused(
    ax: AXClient, elements: ElementBundle, _settings: Settings, _scope: Scope
) -> str | None:
    return ax.string(elements.focused, "AXSelectedText")


def _focused_range(
    ax: AXClient, elements: ElementBundle, _settings: Settings, _scope: Scope
) -> str | None:
    selected_range = ax.attribute(elements.focused, "AXSelectedTextRange")
    if not isinstance(selected_range, dict) or selected_range.get("_type") != "range":
        return None
    length = int(selected_range.get("length") or 0)
    location = int(selected_range.get("location") or 0)
    if length <= 0:
        return None
    value = ax.string(elements.focused, "AXValue")
    if not value or location >= len(value):
        return None
    return value[location : location + length] or None


def _web_area(
    ax: AXClient, elements: ElementBundle, _settings: Settings, _scope: Scope
) -> str | None:
    return _web_area_selection(ax, _enclosing_web_area(ax, elements.focused))


def _search(
    ax: AXClient, elements: ElementBundle, settings: Settings, scope: Scope
) -> str | None:
    if scope is None:
        if not settings.deep_search_selection or elements.window is None:
            return None
        scope = ax.walk(
            elements.window,
            max_depth=SEARCH_MAX_DEPTH,
            max_nodes=SEARCH_MAX_NODES,
            time_budget=SEARCH_TIME_BUDGET,
        )
    for element, _depth in scope:
        text = ax.string(element, "AXSelectedText")
        if text and text.strip():
            return text
        if ax.string(element, "AXRole") == WEB_AREA_ROLE:
            text = text_markers.selection(ax, element)
            if text:
                return text
    return None


def _clipboard(
    ax: AXClient, elements: ElementBundle, settings: Settings, _scope: Scope
) -> str | None:
    if not settings.clipboard_fallback or _exposes_selection(ax, elements):
        return None
    return clipboard.copy_selection()


def _exposes_selection(ax: AXClient, elements: ElementBundle) -> bool:
    names = ax.attribute_names(elements.focused)
    if "AXSelectedText" in names or "AXSelectedTextRange" in names:
        return True
    if _enclosing_web_area(ax, elements.focused) is not None:
        return True
    web_area = ax.find(
        elements.window,
        lambda element: ax.string(element, "AXRole") == WEB_AREA_ROLE,
        max_depth=SEARCH_MAX_DEPTH,
        max_nodes=SEARCH_MAX_NODES,
        time_budget=SEARCH_TIME_BUDGET,
    )
    return web_area is not None


def _enclosing_web_area(ax: AXClient, element: Any) -> Any | None:
    for _ in range(PARENT_HOPS):
        if element is None:
            return None
        if ax.string(element, "AXRole") == WEB_AREA_ROLE:
            return element
        element = ax.element_attribute(element, "AXParent")
    return None


def _web_area_selection(ax: AXClient, web_area: Any) -> str | None:
    if web_area is None:
        return None
    return ax.string(web_area, "AXSelectedText") or text_markers.selection(ax, web_area)


STRATEGIES: list[tuple[str, Strategy]] = [
    ("focused", _focused),
    ("focused-range", _focused_range),
    ("web-area", _web_area),
    ("search", _search),
    ("clipboard", _clipboard),
]
