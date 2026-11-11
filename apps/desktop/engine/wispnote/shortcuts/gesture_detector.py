from __future__ import annotations

import threading
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
        kCGEventSourceUserData,
        kCGEventTapDisabledByTimeout,
        kCGEventTapDisabledByUserInput,
        kCGEventTapOptionListenOnly,
        kCGHeadInsertEventTap,
        kCGKeyboardEventAutorepeat,
        kCGKeyboardEventKeycode,
        kCGScrollWheelEventMomentumPhase,
        kCGSessionEventTap,
    )

    QUARTZ_AVAILABLE = True
except ImportError:
    QUARTZ_AVAILABLE = False

from ..mainthread import run_after, run_on_main
from ..synthetic import SYNTHETIC_EVENT_TAG

LEFT_CONTROL_KEYCODE = 59
LEFT_SHIFT_KEYCODE = 56
ESCAPE_KEYCODE = 53

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

KEY_ESCAPE = "escape"
KEY_CONTROL = "ctrl"

DOUBLE_TAP_WINDOW = 0.25
HOLD_THRESHOLD = 0.4
MAX_TAPS = 2

GESTURES: dict[tuple[str, int, bool], str] = {
    (CONTROL, 1, False): "ctrl+shift",
    (CONTROL, 2, False): "ctrl+shift+shift",
    (CONTROL, 0, True): "ctrl+shift+hold",
    (SHIFT, 1, False): "shift+ctrl",
    (SHIFT, 2, False): "shift+ctrl+ctrl",
    (SHIFT, 0, True): "shift+ctrl+hold",
}

GESTURE_TRIGGERS = list(GESTURES.values())


class GestureDetector:
    _active: GestureDetector | None = None

    def __init__(
        self,
        on_trigger: Callable[[str, str | None], None],
        on_key: Callable[[str], None] | None = None,
    ):
        self.on_trigger = on_trigger
        self.on_key = on_key

        self._tap = None
        self._source = None
        self._running = False

        self._control_down = False
        self._shift_down = False

        self._mode: str | None = None
        self._mode_key_up = False
        self._taps = 0
        self._press_dirty = False
        self._hold_fired = False
        self._tap_timer: threading.Timer | None = None
        self._hold_timer: threading.Timer | None = None
        self._timer_generation = 0

        self._hud_up = False
        self._lone_control = False

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
            kCGEventTapOptionListenOnly,
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

    def set_hud_up(self, up: bool) -> None:
        self._hud_up = up
        if not up:
            self._lone_control = False

    def stop(self) -> None:
        self._reset()
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
            self._reset()
            self._control_down = False
            self._shift_down = False
            return

        if CGEventGetIntegerValueField(event, kCGEventSourceUserData) == SYNTHETIC_EVENT_TAG:
            return

        if event_type == kCGEventFlagsChanged:
            keycode = int(CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode))
            self.handle_flags(keycode, int(CGEventGetFlags(event)))
            return

        if event_type == kCGEventKeyDown and self._hud_up:
            self.handle_key_down(
                int(CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode)),
                bool(CGEventGetIntegerValueField(event, kCGKeyboardEventAutorepeat)),
            )

        if self._mode is None:
            return

        if event_type == kCGEventScrollWheel and CGEventGetIntegerValueField(
            event, kCGScrollWheelEventMomentumPhase
        ):
            return

        self.handle_interruption()

    def handle_key_down(self, keycode: int, repeat: bool) -> None:
        if keycode == ESCAPE_KEYCODE and not repeat:
            self._fire_key(KEY_ESCAPE)

    def handle_interruption(self) -> None:
        self._interrupt(self._other_down())

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
        if self._mode is None:
            was_idle = not self._control_down and not self._shift_down
            if was_idle and not foreign and control_down != shift_down:
                self._mode = CONTROL if control_down else SHIFT
                self._lone_control = control_down and self._hud_up
            return

        if self._mode == CONTROL:
            mode_down, other_down, other_was_down = control_down, shift_down, self._shift_down
        else:
            mode_down, other_down, other_was_down = shift_down, control_down, self._control_down

        if foreign:
            self._interrupt(other_down or other_was_down)

        if other_down and not other_was_down:
            self._other_pressed()
        elif other_was_down and not other_down:
            self._other_released()

        if not mode_down:
            self._mode_key_up = True

        if not mode_down and not other_down:
            self._exit_mode()

    def _other_down(self) -> bool:
        if self._mode == CONTROL:
            return self._shift_down
        if self._mode == SHIFT:
            return self._control_down
        return False

    def _other_pressed(self) -> None:
        self._lone_control = False
        self._cancel_timer(self._tap_timer)
        self._tap_timer = None
        if self._press_dirty:
            return
        self._hold_timer = self._schedule(HOLD_THRESHOLD, self._hold_elapsed)

    def _other_released(self) -> None:
        self._cancel_timer(self._hold_timer)
        self._hold_timer = None

        if self._press_dirty or self._hold_fired:
            self._press_dirty = False
            self._hold_fired = False
            self._taps = 0
            return

        previous = GESTURES.get((self._mode, self._taps, False)) if self._taps else None
        self._taps += 1
        trigger = GESTURES.get((self._mode, self._taps, False))
        if trigger is not None:
            self._fire(trigger, previous)

        if self._taps >= MAX_TAPS or self._mode_key_up:
            self._taps = 0
            return

        self._tap_timer = self._schedule(DOUBLE_TAP_WINDOW, self._close_tap_window)

    def _hold_elapsed(self) -> None:
        if self._mode is None or not self._other_down() or self._press_dirty:
            return

        self._hold_fired = True
        previous = GESTURES.get((self._mode, self._taps, False)) if self._taps else None
        trigger = GESTURES.get((self._mode, self._taps, True))
        if trigger is not None:
            self._fire(trigger, previous)

    def _close_tap_window(self) -> None:
        self._tap_timer = None
        self._taps = 0

    def _interrupt(self, press_in_flight: bool) -> None:
        self._cancel_timers()
        self._taps = 0
        self._hold_fired = False
        self._press_dirty = press_in_flight
        self._lone_control = False

    def _exit_mode(self) -> None:
        lone_control = self._lone_control and self._hud_up
        self._reset()
        if lone_control:
            self._fire_key(KEY_CONTROL)

    def _reset(self) -> None:
        self._cancel_timers()
        self._mode = None
        self._mode_key_up = False
        self._taps = 0
        self._press_dirty = False
        self._hold_fired = False
        self._lone_control = False

    def _schedule(self, delay: float, function: Callable[[], None]) -> threading.Timer:
        generation = self._timer_generation

        def guarded() -> None:
            if generation == self._timer_generation:
                function()

        return run_after(delay, guarded)

    def _cancel_timer(self, timer: threading.Timer | None) -> None:
        if timer is not None:
            timer.cancel()
        self._timer_generation += 1

    def _cancel_timers(self) -> None:
        self._cancel_timer(self._tap_timer)
        self._cancel_timer(self._hold_timer)
        self._tap_timer = None
        self._hold_timer = None

    def _fire(self, trigger: str, supersedes: str | None = None) -> None:
        run_on_main(lambda: self._deliver(trigger, supersedes))

    def _deliver(self, trigger: str, supersedes: str | None) -> None:
        try:
            self.on_trigger(trigger, supersedes)
        except Exception as exc:
            print(f"[wispnote] trigger handler failed for {trigger}: {exc}")

    def _fire_key(self, key: str) -> None:
        run_on_main(lambda: self._deliver_key(key))

    def _deliver_key(self, key: str) -> None:
        if self.on_key is None:
            return
        try:
            self.on_key(key)
        except Exception as exc:
            print(f"[wispnote] key handler failed for {key}: {exc}")


def _event_callback(proxy, event_type, event, refcon):
    detector = GestureDetector._active
    if detector is not None:
        try:
            detector.handle_event(event_type, event)
        except Exception as exc:
            print(f"[wispnote] event tap error: {exc}")
    return event
