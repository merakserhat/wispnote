from __future__ import annotations

from typing import Any

from .ax_client import AXClient
from .extractors import ElementBundle

FIELD_ROLES = {"AXTextField", "AXComboBox", "AXSearchField"}
AREA_ROLE = "AXTextArea"
SEARCH_SUBROLE = "AXSearchField"
SECURE_SUBROLE = "AXSecureTextField"
WEB_AREA_ROLE = "AXWebArea"
PARENT_HOPS = 40
EDITABLE_ANCESTOR = "AXEditableAncestor"
WRITABLE_ATTRIBUTES = ("AXValue", "AXSelectedText", "AXSelectedTextRange")

TERMINAL_BUNDLE_IDS = {
    "com.apple.terminal",
    "com.googlecode.iterm2",
    "com.mitchellh.ghostty",
    "net.kovidgoyal.kitty",
    "org.alacritty",
    "com.github.wez.wezterm",
    "dev.warp.warp-stable",
    "co.zeit.hyper",
}
SELF_DRAWN_EDITOR_PREFIXES = ("com.sublimetext.",)


def detect(ax: AXClient, elements: ElementBundle, bundle_id: str) -> dict[str, Any]:
    focused = elements.focused
    role = ax.string(focused, "AXRole") or ""
    subrole = ax.string(focused, "AXSubrole") or ""
    writable = [name for name in WRITABLE_ATTRIBUTES if ax.is_settable(focused, name)]

    reason = _reason(ax, focused, role, subrole, writable, bundle_id)

    return {
        "editable": reason is not None,
        "reason": reason or _rejection(focused, role, subrole, writable),
        "caret": _caret(ax, focused),
    }


def _reason(
    ax: AXClient,
    focused: Any,
    role: str,
    subrole: str,
    writable: list[str],
    bundle_id: str,
) -> str | None:
    if subrole == SECURE_SUBROLE:
        return None
    if bundle_id.lower() in TERMINAL_BUNDLE_IDS:
        return "terminal"
    if bundle_id.lower().startswith(SELF_DRAWN_EDITOR_PREFIXES):
        return "self-drawn-editor"
    if focused is None:
        return None
    if role in FIELD_ROLES or subrole == SEARCH_SUBROLE:
        return "field"
    if role == AREA_ROLE and writable:
        return "writable-area"
    if ax.element_attribute(focused, EDITABLE_ANCESTOR) is not None:
        return "editable-ancestor"
    return None


def _rejection(focused: Any, role: str, subrole: str, writable: list[str]) -> str:
    if focused is None:
        return "no-focused-element"
    if subrole == SECURE_SUBROLE:
        return "secure-field"
    if role == AREA_ROLE and not writable:
        return "read-only-area"
    return "not-a-text-role"


def _caret(ax: AXClient, focused: Any) -> dict[str, float] | None:
    if focused is None:
        return None
    return _range_caret(ax, focused) or _marker_caret(ax, focused)


def _range_caret(ax: AXClient, focused: Any) -> dict[str, float] | None:
    selected_range = ax.raw_attribute(focused, "AXSelectedTextRange")
    if selected_range is None:
        return None
    return _rect(ax.convert(ax.parameterized(focused, "AXBoundsForRange", selected_range)))


def _marker_caret(ax: AXClient, focused: Any) -> dict[str, float] | None:
    element = focused
    for _ in range(PARENT_HOPS):
        if element is None:
            return None
        marker_range = ax.raw_attribute(element, "AXSelectedTextMarkerRange")
        if marker_range is not None:
            bounds = ax.parameterized(element, "AXBoundsForTextMarkerRange", marker_range)
            return _rect(ax.convert(bounds))
        if ax.string(element, "AXRole") == WEB_AREA_ROLE:
            return None
        element = ax.element_attribute(element, "AXParent")
    return None


def _rect(value: Any) -> dict[str, float] | None:
    if not isinstance(value, dict) or value.get("_type") != "rect":
        return None
    if value["height"] <= 0:
        return None
    return {key: value[key] for key in ("x", "y", "width", "height")}
