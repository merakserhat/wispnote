from __future__ import annotations

from collections.abc import Callable

from ..config import ACTION_NONE, Settings
from .fn_detector import FN_TRIGGERS, FnTriggerDetector


class ShortcutManager:
    def __init__(self, settings: Settings, dispatch: Callable[[str, str], None]):
        self.settings = settings
        self.dispatch = dispatch
        self.detector = FnTriggerDetector(
            self._on_trigger,
            double_interval=settings.fn_double_interval,
            suppress=settings.suppress_fn,
            watched_key_triggers=self._bound_triggers(),
        )
        self.last_error: str | None = None

    def start(self) -> bool:
        if not self.detector.available:
            self.last_error = "Quartz event taps unavailable (PyObjC missing)"
            return False
        if not self.detector.start():
            self.last_error = (
                "Could not create the event tap - grant Accessibility permission "
                "to the app running WispNote, then restart it"
            )
            return False
        self.last_error = None
        return True

    def stop(self) -> None:
        self.detector.stop()

    @property
    def running(self) -> bool:
        return self.detector.running

    def reload(self, settings: Settings | None = None) -> None:
        if settings is not None:
            self.settings = settings
        self.detector.update(
            double_interval=self.settings.fn_double_interval,
            suppress=self.settings.suppress_fn,
            watched_key_triggers=self._bound_triggers(),
        )

    def _bound_triggers(self) -> set[str]:
        return {
            trigger for trigger in FN_TRIGGERS if self.settings.action_for(trigger) != ACTION_NONE
        }

    def _on_trigger(self, trigger: str) -> None:
        action = self.settings.action_for(trigger)
        if action == ACTION_NONE:
            return
        self.dispatch(action, trigger)

    def describe(self) -> list[tuple[str, str]]:
        return [
            (trigger, self.settings.action_for(trigger))
            for trigger in FN_TRIGGERS
            if self.settings.action_for(trigger) != ACTION_NONE
        ]
