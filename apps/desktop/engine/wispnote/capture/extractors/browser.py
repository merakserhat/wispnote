from __future__ import annotations

from typing import Any

from ...models import SOURCE_PDF, SOURCE_WEB, CaptureContext
from ...utils import clean_window_title, file_url_to_path, normalize_url, url_host
from .. import text_markers
from .base import ElementBundle, SourceExtractor

WEB_AREA_MAX_DEPTH = 10
WEB_AREA_MAX_NODES = 400
WEB_AREA_TIME_BUDGET = 0.4


class BrowserExtractor(SourceExtractor):
    name = "browser"

    bundle_ids = {
        "com.google.chrome",
        "com.google.chrome.canary",
        "com.google.chrome.beta",
        "com.apple.safari",
        "com.apple.safaritechnologypreview",
        "com.brave.browser",
        "com.microsoft.edgemac",
        "com.vivaldi.vivaldi",
        "com.operasoftware.opera",
        "org.mozilla.firefox",
        "org.mozilla.firefoxdeveloperedition",
        "company.thebrowser.browser",
        "company.thebrowser.dia",
        "com.kagimacos.kagi",
        "app.zen-browser.zen",
    }
    bundle_prefixes = ("com.google.chrome", "org.mozilla.")
    app_name_hints = ("chrome", "safari", "firefox", "brave", "arc", "edge", "vivaldi", "opera")

    def extract(self, ctx: CaptureContext, ax: Any, elements: ElementBundle) -> None:
        url = self._find_url(ax, elements)
        title = self._find_title(ax, elements, ctx)

        local_pdf = file_url_to_path(url) if url and url.startswith("file://") else None
        if local_pdf and local_pdf.lower().endswith(".pdf"):
            ctx.source_kind = SOURCE_PDF
            ctx.file_path = local_pdf
            ctx.source_key = f"pdf:{local_pdf}"
            ctx.source_title = title or local_pdf.rsplit("/", 1)[-1]
            ctx.extras["opened_in_browser"] = True
            return

        ctx.url = url
        ctx.source_kind = SOURCE_WEB

        if url:
            ctx.source_key = f"web:{normalize_url(url)}"
            ctx.source_title = title or url_host(url) or url
            ctx.extras["host"] = url_host(url)
        else:
            ctx.source_key = f"app:{ctx.bundle_id or ctx.app_name}"
            ctx.source_title = title or ctx.app_name
            ctx.add_error("browser: could not read page URL")

    def extract_context(
        self, ctx: CaptureContext, ax: Any, elements: ElementBundle
    ) -> tuple[str, str] | None:
        web_area = self._web_area(ax, elements)
        if web_area is None:
            return None

        page = text_markers.document(ax, web_area)
        if page is None:
            return None

        pair = text_markers.slice_around(page, ctx.selected_text)
        if pair is None:
            return None

        before, after = pair
        return text_markers.as_prose(before), text_markers.as_prose(after)

    def _web_area(self, ax: Any, elements: ElementBundle) -> Any | None:
        if self._role(ax, elements.focused) == "AXWebArea":
            return elements.focused
        return ax.find(
            elements.window,
            lambda element: self._role(ax, element) == "AXWebArea",
            max_depth=WEB_AREA_MAX_DEPTH,
            max_nodes=WEB_AREA_MAX_NODES,
            time_budget=WEB_AREA_TIME_BUDGET,
        )

    def _find_url(self, ax: Any, elements: ElementBundle) -> str | None:
        url = self._first_string(ax, elements.focused, "AXURL")
        if url:
            return url

        document = self._first_string(ax, elements.window, "AXDocument", "AXURL")
        if document:
            return document

        web_area = self._web_area(ax, elements)
        if web_area is not None:
            return self._first_string(ax, web_area, "AXURL")
        return None

    def _find_title(self, ax: Any, elements: ElementBundle, ctx: CaptureContext) -> str | None:
        title = self._first_string(ax, elements.focused, "AXTitle")
        role = self._role(ax, elements.focused)
        if title and role in ("AXWebArea", "AXGroup", "AXDocument"):
            return title

        window_title = self._first_string(ax, elements.window, "AXTitle") or ctx.window_title
        cleaned = clean_window_title(window_title, ctx.app_name)
        return cleaned or title
