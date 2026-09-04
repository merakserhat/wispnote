from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ...models import CaptureContext


@dataclass
class ElementBundle:
    app: Any = None
    window: Any = None
    focused: Any = None


class SourceExtractor:
    name: str = "generic"
    bundle_ids: set[str] = set()
    bundle_prefixes: tuple[str, ...] = ()
    app_name_hints: tuple[str, ...] = ()

    def matches(self, ctx: CaptureContext) -> bool:
        bundle = (ctx.bundle_id or "").lower()
        if bundle and bundle in {b.lower() for b in self.bundle_ids}:
            return True
        if bundle and any(bundle.startswith(prefix.lower()) for prefix in self.bundle_prefixes):
            return True
        app_name = (ctx.app_name or "").lower()
        return any(hint.lower() in app_name for hint in self.app_name_hints)

    def extract(self, ctx: CaptureContext, ax: Any, elements: ElementBundle) -> None:
        raise NotImplementedError

    def extract_selection(
        self, ctx: CaptureContext, ax: Any, elements: ElementBundle
    ) -> str | None:
        return None

    def extract_context(
        self, ctx: CaptureContext, ax: Any, elements: ElementBundle
    ) -> tuple[str, str] | None:
        return None

    @staticmethod
    def _first_string(ax: Any, element: Any, *names: str) -> str | None:
        for name in names:
            value = ax.string(element, name)
            if value:
                return value
        return None

    @staticmethod
    def _role(ax: Any, element: Any) -> str:
        return (ax.string(element, "AXRole") or "").strip()
