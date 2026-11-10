from __future__ import annotations

from collections.abc import Callable

from ..config import ACTION_NONE, Settings
from .gesture_detector import GESTURE_TRIGGERS, GestureDetector


class ShortcutManager:
    def __init__(
        self,
        settings: Settings,
        dispatch: Callable[[str, str, str | None], None],
        on_key: Callable[[str], None] | None = None,
    ):
        self.settings = settings
        self.dispatch = dispatch
        self.detector = GestureDetector(self._on_trigger, on_key)
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

    def set_hud_up(self, up: bool) -> None:
        self.detector.set_hud_up(up)

    def _on_trigger(self, trigger: str, supersedes: str | None = None) -> None:
        action = self.settings.action_for(trigger)
        if action == ACTION_NONE:
            return
        if supersedes is not None and self.settings.action_for(supersedes) == ACTION_NONE:
            supersedes = None
        self.dispatch(action, trigger, supersedes)

    def describe(self) -> list[tuple[str, str]]:
        return [
            (trigger, self.settings.action_for(trigger))
            for trigger in GESTURE_TRIGGERS
            if self.settings.action_for(trigger) != ACTION_NONE
        ]
