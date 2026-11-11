from __future__ import annotations

import os
import threading
from typing import Any

from .ax_client import AXClient

try:
    from AppKit import (
        NSWorkspace,
        NSWorkspaceApplicationKey,
        NSWorkspaceDidActivateApplicationNotification,
    )

    WORKSPACE_AVAILABLE = True
except ImportError:
    WORKSPACE_AVAILABLE = False

WAKE_ATTRIBUTE = "AXManualAccessibility"
MESSAGING_TIMEOUT = 1.0


class AccessibilityWaker:
    def __init__(self, ax: AXClient) -> None:
        self._ax = ax
        self._checked: dict[int, bool] = {}
        self._lock = threading.Lock()
        self._observer: Any = None

    def watch_activations(self) -> None:
        if not WORKSPACE_AVAILABLE or self._observer is not None:
            return

        workspace = NSWorkspace.sharedWorkspace()
        self._observer = workspace.notificationCenter().addObserverForName_object_queue_usingBlock_(
            NSWorkspaceDidActivateApplicationNotification, None, None, self._on_activated
        )

        frontmost = workspace.frontmostApplication()
        if frontmost is not None:
            self._wake_in_background(int(frontmost.processIdentifier()))

    def wake(self, pid: int) -> bool:
        if pid <= 0 or pid == os.getppid():
            return False
        with self._lock:
            if pid in self._checked:
                return self._checked[pid]

        element = self._ax.application_element(pid)
        self._ax.set_messaging_timeout(element, MESSAGING_TIMEOUT)
        names = self._ax.attribute_names(element)
        if not names:
            return False

        woken = WAKE_ATTRIBUTE in names and self._ax.set_attribute(element, WAKE_ATTRIBUTE, True)
        with self._lock:
            self._checked[pid] = woken
        return woken

    def _on_activated(self, notification: Any) -> None:
        try:
            application = notification.userInfo()[NSWorkspaceApplicationKey]
            self._wake_in_background(int(application.processIdentifier()))
        except Exception:
            return

    def _wake_in_background(self, pid: int) -> None:
        threading.Thread(
            target=self.wake, args=(pid,), name="wispnote-ax-wake", daemon=True
        ).start()
