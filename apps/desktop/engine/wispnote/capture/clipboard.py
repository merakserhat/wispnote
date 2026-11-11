from __future__ import annotations

import time
from typing import Any

from ..synthetic import SYNTHETIC_EVENT_TAG

try:
    from AppKit import NSPasteboard, NSPasteboardItem, NSPasteboardTypeString
    from Quartz import (
        CGEventCreateKeyboardEvent,
        CGEventPost,
        CGEventSetFlags,
        CGEventSetIntegerValueField,
        CGEventSourceCreate,
        kCGAnnotatedSessionEventTap,
        kCGEventFlagMaskCommand,
        kCGEventSourceStatePrivate,
        kCGEventSourceUserData,
    )

    CLIPBOARD_AVAILABLE = True
except ImportError:
    CLIPBOARD_AVAILABLE = False

C_KEYCODE = 8
COPY_TIMEOUT = 0.2
POLL_INTERVAL = 0.01


def copy_selection() -> str | None:
    if not CLIPBOARD_AVAILABLE:
        return None

    pasteboard = NSPasteboard.generalPasteboard()
    saved = _snapshot(pasteboard)
    before = pasteboard.changeCount()

    _post_copy()

    deadline = time.monotonic() + COPY_TIMEOUT
    while pasteboard.changeCount() == before:
        if time.monotonic() > deadline:
            return None
        time.sleep(POLL_INTERVAL)

    text = pasteboard.stringForType_(NSPasteboardTypeString)
    _restore(pasteboard, saved)

    if text is None:
        return None
    text = str(text)
    return text if text.strip() else None


def _post_copy() -> None:
    source = CGEventSourceCreate(kCGEventSourceStatePrivate)
    for key_down in (True, False):
        event = CGEventCreateKeyboardEvent(source, C_KEYCODE, key_down)
        CGEventSetFlags(event, kCGEventFlagMaskCommand)
        CGEventSetIntegerValueField(event, kCGEventSourceUserData, SYNTHETIC_EVENT_TAG)
        CGEventPost(kCGAnnotatedSessionEventTap, event)


def _snapshot(pasteboard: Any) -> list[list[tuple[Any, Any]]]:
    saved: list[list[tuple[Any, Any]]] = []
    for item in pasteboard.pasteboardItems() or []:
        entry = []
        for kind in item.types():
            data = item.dataForType_(kind)
            if data is not None:
                entry.append((kind, data))
        saved.append(entry)
    return saved


def _restore(pasteboard: Any, saved: list[list[tuple[Any, Any]]]) -> None:
    pasteboard.clearContents()
    items = []
    for entry in saved:
        item = NSPasteboardItem.alloc().init()
        for kind, data in entry:
            item.setData_forType_(data, kind)
        items.append(item)
    if items:
        pasteboard.writeObjects_(items)
