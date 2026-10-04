from __future__ import annotations

import contextlib
import json
import os
import sys
import threading
import time
from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor
from typing import Any

from .. import __version__
from ..capture.context_capture import ContextCapture
from ..config import Settings
from ..mainthread import is_main_thread, run_on_main
from ..pdf.tools import PdfTools
from ..shortcuts.manager import ShortcutManager
from .channel import Channel
from .commands import Commands

PROTOCOL_VERSION = 2
HEARTBEAT_SECONDS = 2.0
MAIN_THREAD_TIMEOUT = 20.0
ORPHAN_CHECK_SECONDS = 2.0
SHUTDOWN_DELAY_SECONDS = 0.1
COMMAND_WORKERS = 4


class Bridge:
    def __init__(
        self,
        channel: Channel,
        *,
        tap: bool = True,
        heartbeat: float = HEARTBEAT_SECONDS,
    ) -> None:
        self.channel = channel
        self.want_tap = tap
        self.heartbeat_seconds = heartbeat

        self.settings = Settings()
        self.capture = ContextCapture(self.settings)
        self.shortcuts = ShortcutManager(self.settings, self.on_gesture)
        self.pdf = PdfTools()
        self.commands = Commands(
            capture=self.capture,
            shortcuts=self.shortcuts,
            pdf=self.pdf,
            on_main=self.on_main,
            request_stop=self._stop_soon,
        )

        self._stopping = threading.Event()
        self._sequence = 0
        self._workers = ThreadPoolExecutor(
            max_workers=COMMAND_WORKERS, thread_name_prefix="wispnote-command"
        )

    def start(self) -> None:
        tap_started = self.want_tap and self.shortcuts.start()
        if self.want_tap and not tap_started:
            self.channel.log(self.shortcuts.last_error or "event tap unavailable")

        self.channel.send(
            "ready",
            protocol=PROTOCOL_VERSION,
            version=__version__,
            pid=os.getpid(),
            python=sys.version.split()[0],
            accessibility=self.capture.has_permission(),
            tap=tap_started,
            tap_error=None if tap_started else self.shortcuts.last_error,
            pdf=self.pdf.available,
            heartbeat=self.heartbeat_seconds,
            triggers=self.commands.describe_triggers(),
        )

        for name, target in (
            ("heartbeat", self._heartbeat_loop),
            ("orphan", self._orphan_loop),
            ("stdin", self._read_commands),
        ):
            threading.Thread(target=target, name=f"wispnote-{name}", daemon=True).start()

    def stop(self, reason: str = "") -> None:
        if self._stopping.is_set():
            return
        self._stopping.set()
        self.channel.log(f"shutting down ({reason or 'no reason given'})")

        for step in (self.shortcuts.stop, lambda: self._workers.shutdown(wait=False)):
            try:
                step()
            except BaseException as exc:
                self.channel.log(f"shutdown step failed: {exc}")

        with contextlib.suppress(Exception):
            sys.stderr.flush()

        os._exit(0)

    def _stop_soon(self) -> None:
        threading.Timer(SHUTDOWN_DELAY_SECONDS, lambda: self.stop("host asked")).start()

    def on_gesture(self, action: str, trigger: str = "") -> None:
        self.channel.log(f"trigger {trigger} -> {action}")
        try:
            ctx = self.commands.capture_context()
        except Exception as exc:
            self.channel.log(f"trigger {trigger} failed: {exc}")
            self.channel.send("error", message=str(exc), trigger=trigger)
            return

        self.channel.send(
            "trigger",
            trigger=trigger,
            action=action,
            context=ctx.to_dict(),
            can_sync=self.commands.can_sync(ctx),
        )

    def _read_commands(self) -> None:
        for line in sys.stdin:
            if self._stopping.is_set():
                return
            message = self._parse_line(line)
            if message is not None:
                self._workers.submit(self._handle, message)

        self.stop("host closed stdin")

    def _parse_line(self, line: str) -> dict[str, Any] | None:
        line = line.strip()
        if not line:
            return None
        try:
            message = json.loads(line)
        except json.JSONDecodeError as exc:
            self.channel.send("error", message=f"bad JSON: {exc}")
            return None
        if not isinstance(message, dict):
            self.channel.send("error", message="expected a JSON object")
            return None
        return message

    def _handle(self, message: dict[str, Any]) -> None:
        request_id = message.get("id")
        command = str(message.get("cmd", ""))
        try:
            data = self.commands.handle(command, message)
        except Exception as exc:
            self.channel.log(f"command {command} failed: {exc}")
            self._reply(request_id, ok=False, error=str(exc))
        else:
            self._reply(request_id, ok=True, data=data)

    def _reply(
        self, request_id: Any, *, ok: bool, data: Any = None, error: str | None = None
    ) -> None:
        if request_id is None:
            return
        self.channel.send("result", id=request_id, ok=ok, data=data, error=error)

    def _heartbeat_loop(self) -> None:
        while not self._stopping.wait(self.heartbeat_seconds):
            self._sequence += 1
            self.channel.send(
                "heartbeat",
                seq=self._sequence,
                uptime=self.commands.uptime,
                tap=self.shortcuts.running,
            )

    def _orphan_loop(self) -> None:
        parent = os.getppid()
        while not self._stopping.wait(ORPHAN_CHECK_SECONDS):
            current = os.getppid()
            if current != parent or current == 1:
                self.stop("host process died")
                return

    def on_main(self, function: Callable[[], Any]) -> Any:
        if is_main_thread():
            return function()

        outcome: dict[str, Any] = {}
        done = threading.Event()

        def wrapper() -> None:
            try:
                outcome["value"] = function()
            except BaseException as exc:
                outcome["error"] = exc
            finally:
                done.set()

        run_on_main(wrapper, force_async=True)
        if not done.wait(MAIN_THREAD_TIMEOUT):
            raise TimeoutError("main thread did not respond")
        if "error" in outcome:
            raise outcome["error"]
        return outcome.get("value")


def serve(*, tap: bool = True, heartbeat: float = HEARTBEAT_SECONDS) -> int:
    channel = Channel()
    bridge = Bridge(channel, tap=tap, heartbeat=heartbeat)
    bridge.start()
    _run_loop(channel)
    return 0


def _run_loop(channel: Channel) -> None:
    try:
        from AppKit import NSApplication, NSApplicationActivationPolicyProhibited
    except ImportError:
        channel.log("AppKit unavailable - idling without a run loop")
        while True:
            time.sleep(3600)

    app = NSApplication.sharedApplication()
    app.setActivationPolicy_(NSApplicationActivationPolicyProhibited)
    app.run()
