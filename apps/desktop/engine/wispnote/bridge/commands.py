from __future__ import annotations

import os
import time
from collections.abc import Callable
from typing import Any

from ..capture.context_capture import ContextCapture
from ..config import Settings
from ..models import CaptureContext
from ..pdf.tools import PdfTools
from ..shortcuts.manager import ShortcutManager

RunOnMain = Callable[[Callable[[], Any]], Any]


class CommandError(Exception):
    pass


class Commands:
    def __init__(
        self,
        *,
        capture: ContextCapture,
        shortcuts: ShortcutManager,
        pdf: PdfTools,
        on_main: RunOnMain,
        request_stop: Callable[[], None],
    ) -> None:
        self.capture = capture
        self.shortcuts = shortcuts
        self.pdf = pdf
        self.on_main = on_main
        self.request_stop = request_stop
        self.started_at = time.monotonic()

        self._handlers: dict[str, Callable[[dict[str, Any]], Any]] = {
            "ping": self.ping,
            "capture": self.capture_command,
            "configure": self.configure,
            "pdf_info": self.pdf_info,
            "pdf_locate": self.pdf_locate,
            "pdf_annotations": self.pdf_annotations,
            "shutdown": self.shutdown,
        }

    def handle(self, command: str, message: dict[str, Any]) -> Any:
        handler = self._handlers.get(command)
        if handler is None:
            raise CommandError(f"unknown command {command!r}")
        return handler(message)

    def ping(self, _message: dict[str, Any]) -> dict[str, Any]:
        return {"pong": True, "uptime": self.uptime, "tap": self.shortcuts.running}

    def capture_command(self, _message: dict[str, Any]) -> dict[str, Any]:
        ctx = self.capture_context()
        return {"context": ctx.to_dict(), "can_sync": self.can_sync(ctx)}

    def configure(self, message: dict[str, Any]) -> dict[str, Any]:
        raw = message.get("settings")
        if not isinstance(raw, dict):
            raise CommandError("configure needs a `settings` object")

        settings = Settings.from_dict(raw)
        self.on_main(lambda: self._apply(settings))
        return {"triggers": self.describe_triggers()}

    def pdf_info(self, message: dict[str, Any]) -> dict[str, Any]:
        return self.pdf.document_info(self._file_path(message))

    def pdf_locate(self, message: dict[str, Any]) -> dict[str, Any]:
        text = message.get("text")
        if not isinstance(text, str) or not text:
            raise CommandError("pdf_locate needs `text`")
        page_hint = message.get("page_hint")
        return self.pdf.locate(
            self._file_path(message),
            text,
            page_hint=page_hint if isinstance(page_hint, int) else None,
        )

    def pdf_annotations(self, message: dict[str, Any]) -> dict[str, Any]:
        return {"annotations": self.pdf.import_annotations(self._file_path(message))}

    def shutdown(self, _message: dict[str, Any]) -> dict[str, Any]:
        self.request_stop()
        return {"stopping": True}

    @property
    def uptime(self) -> float:
        return round(time.monotonic() - self.started_at, 1)

    def capture_context(self) -> CaptureContext:
        return self.on_main(self.capture.capture)

    def can_sync(self, ctx: CaptureContext) -> bool:
        return bool(
            self.pdf.available and ctx.can_sync and ctx.file_path and os.path.exists(ctx.file_path)
        )

    def describe_triggers(self) -> list[dict[str, str]]:
        return [
            {"trigger": trigger, "action": action} for trigger, action in self.shortcuts.describe()
        ]

    def _apply(self, settings: Settings) -> None:
        self.capture.settings = settings
        self.shortcuts.reload(settings)

    @staticmethod
    def _file_path(message: dict[str, Any]) -> str:
        file_path = message.get("file_path")
        if not isinstance(file_path, str) or not file_path:
            raise CommandError("this command needs `file_path`")
        return file_path
