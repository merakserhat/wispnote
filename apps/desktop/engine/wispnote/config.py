from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

ACTION_NONE = "none"
ACTION_SHOW_PANEL = "show_panel"
ACTION_QUICK_HIGHLIGHT = "quick_highlight"
ACTION_QUICK_NOTE = "quick_note"
ACTION_SYNC_SOURCE = "sync_source"
ACTION_OPEN_NOTES = "open_notes"

DEFAULT_TRIGGERS: dict[str, str] = {
    "ctrl+shift": ACTION_SHOW_PANEL,
    "ctrl+shift+shift": ACTION_QUICK_HIGHLIGHT,
    "shift+ctrl": ACTION_QUICK_NOTE,
    "shift+ctrl+ctrl": ACTION_NONE,
}


@dataclass
class Settings:
    triggers: dict[str, str] = field(default_factory=lambda: dict(DEFAULT_TRIGGERS))

    max_selection_chars: int = 20_000
    max_context_chars: int = 600
    deep_search_selection: bool = True

    def action_for(self, trigger: str) -> str:
        return self.triggers.get(trigger, ACTION_NONE)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> Settings:
        known = cls.__dataclass_fields__
        kwargs = {key: value for key, value in raw.items() if key in known}
        kwargs["triggers"] = {**DEFAULT_TRIGGERS, **(kwargs.get("triggers") or {})}
        return cls(**kwargs)
