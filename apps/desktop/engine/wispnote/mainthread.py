from __future__ import annotations

import threading
from collections.abc import Callable

try:
    from Foundation import NSOperationQueue, NSThread

    COCOA_AVAILABLE = True
except ImportError:
    COCOA_AVAILABLE = False


def is_main_thread() -> bool:
    if COCOA_AVAILABLE:
        return bool(NSThread.isMainThread())
    return threading.current_thread() is threading.main_thread()


def run_on_main(function: Callable[[], None], force_async: bool = False) -> None:
    if not COCOA_AVAILABLE:
        function()
        return

    if is_main_thread() and not force_async:
        function()
        return

    def wrapper() -> None:
        try:
            function()
        except Exception as exc:
            print(f"[wispnote] main-thread callback failed: {exc}")

    NSOperationQueue.mainQueue().addOperationWithBlock_(wrapper)


def run_after(delay: float, function: Callable[[], None]) -> threading.Timer:
    timer = threading.Timer(delay, lambda: run_on_main(function, force_async=True))
    timer.daemon = True
    timer.start()
    return timer
