from __future__ import annotations

import threading
import time
from collections.abc import Callable

try:
    from Quartz import (
        CFMachPortCreateRunLoopSource,
        CFRunLoopAddSource,
        CFRunLoopGetCurrent,
        CFRunLoopRemoveSource,
        CGEventGetFlags,
        CGEventGetIntegerValueField,
        CGEventMaskBit,
        CGEventTapCreate,
        CGEventTapEnable,
        kCFRunLoopCommonModes,
        kCGEventFlagsChanged,
        kCGEventKeyDown,
        kCGEventTapDisabledByTimeout,
        kCGEventTapDisabledByUserInput,
        kCGEventTapOptionDefault,
        kCGHeadInsertEventTap,
        kCGKeyboardEventKeycode,
        kCGSessionEventTap,
    )

    QUARTZ_AVAILABLE = True
except ImportError:
    QUARTZ_AVAILABLE = False

from ..mainthread import run_on_main

FN_FLAG = 0x800000
OTHER_MODIFIERS = 0x1F0000

DIGIT_KEYCODES = {
    18: "1",
    19: "2",
    20: "3",
    21: "4",
    23: "5",
    22: "6",
    26: "7",
    28: "8",
    25: "9",
    29: "0",
}

FN_TRIGGERS = ["fn", "double_fn"] + [f"fn+{digit}" for digit in "1234567890"]

MAX_TAP_DURATION = 0.8


class FnTriggerDetector:
    _active: FnTriggerDetector | None = None

    def __init__(
        self,
        on_trigger: Callable[[str], None],
        *,
        double_interval: float = 0.35,
        suppress: bool = True,
        watched_key_triggers: set[str] | None = None,
    ):
        self.on_trigger = on_trigger
        self.double_interval = double_interval
        self.suppress = suppress
        self.watched_key_triggers = watched_key_triggers or set()

        self._tap = None
        self._source = None
        self._running = False

        self._fn_down = False
        self._fn_consumed = False
        self._fn_alone_press = False
        self._fn_pressed_at = 0.0
        self._pending_single: threading.Timer | None = None
        self._lock = threading.Lock()

    @property
    def available(self) -> bool:
        return QUARTZ_AVAILABLE

    @property
    def running(self) -> bool:
        return self._running

    def update(
        self,
        *,
        double_interval: float | None = None,
        suppress: bool | None = None,
        watched_key_triggers: set[str] | None = None,
    ) -> None:
        if double_interval is not None:
            self.double_interval = double_interval
        if suppress is not None:
            self.suppress = suppress
        if watched_key_triggers is not None:
            self.watched_key_triggers = watched_key_triggers

    def start(self) -> bool:
        if not QUARTZ_AVAILABLE:
            return False
        if self._running:
            return True

        mask = CGEventMaskBit(kCGEventFlagsChanged) | CGEventMaskBit(kCGEventKeyDown)
        FnTriggerDetector._active = self

        self._tap = CGEventTapCreate(
            kCGSessionEventTap,
            kCGHeadInsertEventTap,
            kCGEventTapOptionDefault,
            mask,
            _event_callback,
            None,
        )
        if self._tap is None:
            FnTriggerDetector._active = None
            return False

        self._source = CFMachPortCreateRunLoopSource(None, self._tap, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), self._source, kCFRunLoopCommonModes)
        CGEventTapEnable(self._tap, True)
        self._running = True
        return True

    def stop(self) -> None:
        self._cancel_pending()
        if self._tap is not None:
            try:
                CGEventTapEnable(self._tap, False)
                if self._source is not None:
                    CFRunLoopRemoveSource(
                        CFRunLoopGetCurrent(), self._source, kCFRunLoopCommonModes
                    )
            except Exception:
                pass
        self._tap = None
        self._source = None
        self._running = False
        if FnTriggerDetector._active is self:
            FnTriggerDetector._active = None

    def handle_event(self, event_type: int, event) -> bool:
        if event_type in (kCGEventTapDisabledByTimeout, kCGEventTapDisabledByUserInput):
            if self._tap is not None:
                CGEventTapEnable(self._tap, True)
            return False

        if event_type == kCGEventFlagsChanged:
            return self._handle_flags(CGEventGetFlags(event))

        if event_type == kCGEventKeyDown and self._fn_down:
            keycode = int(CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode))
            return self._handle_key(keycode)

        return False

    def _handle_flags(self, flags: int) -> bool:
        fn_down = bool(flags & FN_FLAG)
        fn_alone = fn_down and not (flags & OTHER_MODIFIERS)

        if fn_down and not self._fn_down:
            self._fn_down = True
            self._fn_consumed = False
            self._fn_alone_press = fn_alone
            self._fn_pressed_at = time.monotonic()

            if fn_alone and self._cancel_pending():
                self._fn_consumed = True
                self._fire("double_fn")
            return self._should_suppress_fn(fn_alone)

        if not fn_down and self._fn_down:
            self._fn_down = False
            held = time.monotonic() - self._fn_pressed_at
            if self._fn_alone_press and not self._fn_consumed and held < MAX_TAP_DURATION:
                self._start_pending_single()
            return self._should_suppress_fn(self._fn_alone_press)

        return False

    def _handle_key(self, keycode: int) -> bool:
        digit = DIGIT_KEYCODES.get(keycode)
        if digit is None:
            return False

        trigger = f"fn+{digit}"
        if trigger not in self.watched_key_triggers:
            return False

        self._fn_consumed = True
        self._cancel_pending()
        self._fire(trigger)
        return True

    def _should_suppress_fn(self, fn_alone: bool) -> bool:
        if not self.suppress or not fn_alone:
            return False
        return bool({"fn", "double_fn"} & set(self.watched_key_triggers))

    def _start_pending_single(self) -> None:
        with self._lock:
            self._pending_single = threading.Timer(self.double_interval, self._fire_single)
            self._pending_single.daemon = True
            self._pending_single.start()

    def _fire_single(self) -> None:
        with self._lock:
            self._pending_single = None
        self._fire("fn")

    def _cancel_pending(self) -> bool:
        with self._lock:
            timer, self._pending_single = self._pending_single, None
        if timer is None:
            return False
        timer.cancel()
        return True

    def _fire(self, trigger: str) -> None:
        run_on_main(lambda: self._deliver(trigger))

    def _deliver(self, trigger: str) -> None:
        try:
            self.on_trigger(trigger)
        except Exception as exc:
            print(f"[wispnote] trigger handler failed for {trigger}: {exc}")


def _event_callback(proxy, event_type, event, refcon):
    detector = FnTriggerDetector._active
    if detector is None:
        return event
    try:
        if detector.handle_event(event_type, event):
            return None
    except Exception as exc:
        print(f"[wispnote] event tap error: {exc}")
    return event
