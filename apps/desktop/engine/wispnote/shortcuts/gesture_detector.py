from __future__ import annotations

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
        kCGEventLeftMouseDown,
        kCGEventOtherMouseDown,
        kCGEventRightMouseDown,
        kCGEventScrollWheel,
        kCGEventTapDisabledByTimeout,
        kCGEventTapDisabledByUserInput,
        kCGEventTapOptionDefault,
        kCGHeadInsertEventTap,
        kCGKeyboardEventKeycode,
        kCGScrollWheelEventMomentumPhase,
        kCGSessionEventTap,
    )

    QUARTZ_AVAILABLE = True
except ImportError:
    QUARTZ_AVAILABLE = False

from ..mainthread import run_on_main

LEFT_CONTROL_KEYCODE = 59
LEFT_SHIFT_KEYCODE = 56

CONTROL_FLAG = 0x40000
SHIFT_FLAG = 0x20000
OPTION_FLAG = 0x80000
COMMAND_FLAG = 0x100000
FN_FLAG = 0x800000
RIGHT_SHIFT_DEVICE_FLAG = 0x4
RIGHT_CONTROL_DEVICE_FLAG = 0x2000
OTHER_MODIFIERS = (
    OPTION_FLAG | COMMAND_FLAG | FN_FLAG | RIGHT_SHIFT_DEVICE_FLAG | RIGHT_CONTROL_DEVICE_FLAG
)

CONTROL = "ctrl"
SHIFT = "shift"

GESTURES: dict[tuple[str, int], str] = {
    (CONTROL, 1): "ctrl+shift",
    (CONTROL, 2): "ctrl+shift+shift",
    (SHIFT, 1): "shift+ctrl",
    (SHIFT, 2): "shift+ctrl+ctrl",
}

GESTURE_TRIGGERS = list(GESTURES.values())

MAX_GESTURE_DURATION = 1.5


class GestureDetector:
    _active: GestureDetector | None = None

    def __init__(self, on_trigger: Callable[[str], None]):
        self.on_trigger = on_trigger

        self._tap = None
        self._source = None
        self._running = False

        self._control_down = False
        self._shift_down = False
        self._anchor: str | None = None
        self._taps = 0
        self._dirty = False
        self._started_at = 0.0

    @property
    def available(self) -> bool:
        return QUARTZ_AVAILABLE

    @property
    def running(self) -> bool:
        return self._running

    def start(self) -> bool:
        if not QUARTZ_AVAILABLE:
            return False
        if self._running:
            return True

        mask = (
            CGEventMaskBit(kCGEventFlagsChanged)
            | CGEventMaskBit(kCGEventKeyDown)
            | CGEventMaskBit(kCGEventLeftMouseDown)
            | CGEventMaskBit(kCGEventRightMouseDown)
            | CGEventMaskBit(kCGEventOtherMouseDown)
            | CGEventMaskBit(kCGEventScrollWheel)
        )
        GestureDetector._active = self

        self._tap = CGEventTapCreate(
            kCGSessionEventTap,
            kCGHeadInsertEventTap,
            kCGEventTapOptionDefault,
            mask,
            _event_callback,
            None,
        )
        if self._tap is None:
            GestureDetector._active = None
            return False

        self._source = CFMachPortCreateRunLoopSource(None, self._tap, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), self._source, kCFRunLoopCommonModes)
        CGEventTapEnable(self._tap, True)
        self._running = True
        return True

    def stop(self) -> None:
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
        if GestureDetector._active is self:
            GestureDetector._active = None

    def handle_event(self, event_type: int, event) -> None:
        if event_type in (kCGEventTapDisabledByTimeout, kCGEventTapDisabledByUserInput):
            if self._tap is not None:
                CGEventTapEnable(self._tap, True)
            self._dirty = True
            return

        if event_type == kCGEventFlagsChanged:
            keycode = int(CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode))
            self.handle_flags(keycode, int(CGEventGetFlags(event)))
            return

        if event_type == kCGEventScrollWheel and CGEventGetIntegerValueField(
            event, kCGScrollWheelEventMomentumPhase
        ):
            return

        self.handle_interruption()

    def handle_interruption(self) -> None:
        self._dirty = True

    def handle_flags(self, keycode: int, flags: int) -> None:
        control_down = self._control_down and bool(flags & CONTROL_FLAG)
        shift_down = self._shift_down and bool(flags & SHIFT_FLAG)
        if keycode == LEFT_CONTROL_KEYCODE:
            control_down = bool(flags & CONTROL_FLAG)
        elif keycode == LEFT_SHIFT_KEYCODE:
            shift_down = bool(flags & SHIFT_FLAG)

        foreign = keycode not in (LEFT_CONTROL_KEYCODE, LEFT_SHIFT_KEYCODE) or bool(
            flags & OTHER_MODIFIERS
        )
        self._advance(control_down, shift_down, foreign)
        self._control_down = control_down
        self._shift_down = shift_down

    def _advance(self, control_down: bool, shift_down: bool, foreign: bool) -> None:
        if self._anchor is None:
            was_idle = not self._control_down and not self._shift_down
            if was_idle and control_down != shift_down:
                self._anchor = CONTROL if control_down else SHIFT
                self._taps = 0
                self._dirty = foreign
                self._started_at = time.monotonic()
            return

        if foreign:
            self._dirty = True

        if self._anchor == CONTROL:
            anchor_down, other_down, other_was_down = control_down, shift_down, self._shift_down
        else:
            anchor_down, other_down, other_was_down = shift_down, control_down, self._control_down

        if other_was_down and not other_down:
            self._taps += 1
        if not anchor_down and other_down:
            self._dirty = True
        if not control_down and not shift_down:
            self._finish()

    def _finish(self) -> None:
        anchor, taps, dirty = self._anchor, self._taps, self._dirty
        self._anchor = None
        self._taps = 0
        self._dirty = False

        if dirty or anchor is None:
            return
        if time.monotonic() - self._started_at > MAX_GESTURE_DURATION:
            return

        trigger = GESTURES.get((anchor, taps))
        if trigger is not None:
            self._fire(trigger)

    def _fire(self, trigger: str) -> None:
        run_on_main(lambda: self._deliver(trigger))

    def _deliver(self, trigger: str) -> None:
        try:
            self.on_trigger(trigger)
        except Exception as exc:
            print(f"[wispnote] trigger handler failed for {trigger}: {exc}")


def _event_callback(proxy, event_type, event, refcon):
    detector = GestureDetector._active
    if detector is not None:
        try:
            detector.handle_event(event_type, event)
        except Exception as exc:
            print(f"[wispnote] event tap error: {exc}")
    return event
