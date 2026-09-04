from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .utils import now_iso

SOURCE_WEB = "web"
SOURCE_PDF = "pdf"
SOURCE_FILE = "file"
SOURCE_MAIL = "mail"
SOURCE_APP = "app"


@dataclass
class CaptureContext:
    timestamp: str = field(default_factory=now_iso)

    app_name: str = ""
    bundle_id: str = ""
    pid: int = 0

    window_title: str = ""
    element_role: str = ""
    element_subrole: str = ""

    selected_text: str = ""
    selection_truncated: bool = False
    context_before: str = ""
    context_after: str = ""

    source_kind: str = SOURCE_APP
    source_key: str = ""
    source_title: str = ""
    url: str | None = None
    file_path: str | None = None

    page_number: int | None = None
    line_number: int | None = None
    section: str | None = None

    extras: dict[str, Any] = field(default_factory=dict)
    errors: list[str] = field(default_factory=list)

    @property
    def has_selection(self) -> bool:
        return bool(self.selected_text and self.selected_text.strip())

    @property
    def can_sync(self) -> bool:
        return self.source_kind == SOURCE_PDF and bool(self.file_path)

    def add_error(self, message: str) -> None:
        self.errors.append(message)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> CaptureContext:
        known = cls.__dataclass_fields__
        return cls(**{key: value for key, value in raw.items() if key in known})
