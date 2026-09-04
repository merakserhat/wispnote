from __future__ import annotations

import time
from typing import Any

from ..config import Settings
from ..models import CaptureContext
from ..utils import clean_window_title
from .ax_client import AXClient, AXUnavailable, is_trusted
from .extractors import ElementBundle, SourceExtractor, default_extractors, select_extractor


class ContextCapture:
    def __init__(
        self,
        settings: Settings | None = None,
        ax: AXClient | None = None,
        extractors: list[SourceExtractor] | None = None,
        require_permission: bool = True,
    ):
        self.settings = settings or Settings()
        self.extractors = extractors or default_extractors()
        self.require_permission = require_permission
        self._ax = ax
        self._ax_error: str | None = None

        if self._ax is None:
            try:
                self._ax = AXClient()
            except AXUnavailable as exc:
                self._ax_error = str(exc)

    @property
    def available(self) -> bool:
        return self._ax is not None

    @staticmethod
    def has_permission(prompt: bool = False) -> bool:
        return is_trusted(prompt=prompt)

    def capture(self, include_raw: bool = True) -> CaptureContext:
        ctx = CaptureContext()
        started = time.monotonic()

        if self._ax is None:
            ctx.add_error(self._ax_error or "accessibility unavailable")
            return ctx
        if self.require_permission and not is_trusted(prompt=False):
            ctx.add_error("accessibility permission not granted")
            return ctx

        ax = self._ax
        elements = ElementBundle()
        extractor: SourceExtractor | None = None

        try:
            application = ax.frontmost_application()
            if application is None:
                ctx.add_error("no frontmost application")
                return ctx

            ctx.app_name = str(application.localizedName() or "")
            ctx.bundle_id = str(application.bundleIdentifier() or "")
            ctx.pid = int(application.processIdentifier())

            elements.app = ax.application_element(ctx.pid)
            elements.window = ax.focused_window(elements.app)
            elements.focused = ax.focused_element() or ax.attribute(
                elements.app, "AXFocusedUIElement"
            )

            ctx.window_title = (
                ax.string(elements.window, "AXTitle") or ax.string(elements.app, "AXTitle") or ""
            )
            ctx.element_role = ax.string(elements.focused, "AXRole") or ""
            ctx.element_subrole = ax.string(elements.focused, "AXSubrole") or ""

            document = ax.string(elements.window, "AXDocument")
            if document:
                ctx.extras["document_path"] = document

            extractor = select_extractor(ctx, self.extractors)
            self._read_selection(ctx, ax, elements, extractor)

            if ctx.has_selection:
                self._read_context(ctx, ax, elements, extractor)

        except Exception as exc:
            ctx.add_error(f"capture failed: {exc}")

        if extractor is None:
            extractor = select_extractor(ctx, self.extractors)
        try:
            extractor.extract(ctx, self._ax, elements)
        except Exception as exc:
            ctx.add_error(f"{extractor.name} extractor failed: {exc}")
        ctx.extras["extractor"] = extractor.name

        if not ctx.source_key:
            ctx.source_key = f"app:{ctx.bundle_id or ctx.app_name or 'unknown'}"
        if not ctx.source_title:
            ctx.source_title = clean_window_title(ctx.window_title, ctx.app_name) or ctx.app_name

        if include_raw:
            ctx.extras["raw"] = self._raw_summary(ax, elements)
        ctx.extras["capture_ms"] = int((time.monotonic() - started) * 1000)
        return ctx

    def _read_selection(
        self,
        ctx: CaptureContext,
        ax: AXClient,
        elements: ElementBundle,
        extractor: SourceExtractor | None = None,
    ) -> None:
        selection: str | None = None
        if extractor is not None:
            try:
                selection = extractor.extract_selection(ctx, ax, elements)
                if selection:
                    ctx.extras["selection_source"] = extractor.name
            except Exception as exc:
                ctx.add_error(f"{extractor.name} selection failed: {exc}")

        if not selection:
            selection = ax.string(elements.focused, "AXSelectedText")

        if not selection:
            selection = self._selection_from_range(ax, elements.focused)

        if not selection and self.settings.deep_search_selection and elements.window is not None:
            selection = self._search_selection(ax, elements.window)
            if selection:
                ctx.extras["selection_source"] = "window-search"

        if not selection:
            return

        limit = self.settings.max_selection_chars
        if limit and len(selection) > limit:
            ctx.selection_truncated = True
            ctx.extras["selection_original_length"] = len(selection)
            selection = selection[:limit]

        ctx.selected_text = selection

    @staticmethod
    def _selection_from_range(ax: AXClient, element: Any) -> str | None:
        selected_range = ax.attribute(element, "AXSelectedTextRange")
        if not isinstance(selected_range, dict) or selected_range.get("_type") != "range":
            return None
        length = int(selected_range.get("length") or 0)
        location = int(selected_range.get("location") or 0)
        if length <= 0:
            return None
        value = ax.string(element, "AXValue")
        if not value or location >= len(value):
            return None
        return value[location : location + length] or None

    def _search_selection(self, ax: AXClient, window: Any) -> str | None:
        for element, _depth in ax.walk(window, max_depth=8, max_nodes=250, time_budget=0.4):
            text = ax.string(element, "AXSelectedText")
            if text and text.strip():
                return text
        return None

    def _read_context(
        self,
        ctx: CaptureContext,
        ax: AXClient,
        elements: ElementBundle,
        extractor: SourceExtractor | None,
    ) -> None:
        if extractor is None:
            return
        try:
            pair = extractor.extract_context(ctx, ax, elements)
        except Exception as exc:
            ctx.add_error(f"{extractor.name} context failed: {exc}")
            return
        if pair is None:
            return

        limit = self.settings.max_context_chars
        before, after = pair
        ctx.context_before = before[-limit:] if limit else before
        ctx.context_after = after[:limit] if limit else after
        ctx.extras["context_source"] = extractor.name

    @staticmethod
    def _raw_summary(ax: AXClient, elements: ElementBundle) -> dict[str, Any]:
        try:
            return {
                "focused_element": ax.summarize(elements.focused),
                "focused_window": ax.summarize(elements.window),
            }
        except Exception:
            return {}
