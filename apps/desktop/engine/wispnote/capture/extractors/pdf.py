from __future__ import annotations

import re
from typing import Any

from ...models import SOURCE_PDF, CaptureContext
from ...utils import file_url_to_path
from .base import ElementBundle, SourceExtractor

_PAGE_OF_RE = re.compile(r"\b(\d{1,5})\s*(?:of|/|de|von|sur)\s*(\d{1,5})\b", re.IGNORECASE)
_PAGE_WORD_RE = re.compile(r"\b(?:page|sayfa|seite|página)\s*[:#]?\s*(\d{1,5})\b", re.IGNORECASE)
_DIGITS_RE = re.compile(r"^\s*(\d{1,5})\s*$")

_TEXTUAL_ROLES = {
    "AXStaticText",
    "AXTextField",
    "AXTextArea",
    "AXValueIndicator",
    "AXImage",
    "AXGroup",
}


class PdfExtractor(SourceExtractor):
    name = "pdf"

    bundle_ids = {
        "com.apple.preview",
        "net.sourceforge.skim-app.skim",
        "com.adobe.reader",
        "com.adobe.acrobat.pro",
        "com.readdle.pdfexpert-mac",
        "com.apple.ibooks",
        "com.apple.books",
        "com.kodeco.pdfviewer",
        "com.marginnote.marginnote3",
    }
    app_name_hints = ("preview", "skim", "acrobat", "adobe reader", "pdf expert", "pdf viewer")

    def matches(self, ctx: CaptureContext) -> bool:
        if super().matches(ctx):
            return True
        document = ctx.extras.get("document_path") or ""
        return str(document).lower().endswith(".pdf")

    def extract(self, ctx: CaptureContext, ax: Any, elements: ElementBundle) -> None:
        path = self._find_path(ax, elements, ctx)
        ctx.source_kind = SOURCE_PDF
        ctx.file_path = path

        if path:
            ctx.source_key = f"pdf:{path}"
            ctx.source_title = path.rsplit("/", 1)[-1].removesuffix(".pdf")
        else:
            title = ctx.window_title or ctx.app_name
            ctx.source_key = f"pdf-window:{ctx.bundle_id}:{title}"
            ctx.source_title = title
            ctx.add_error("pdf: could not read document path")

        page, total, hint = self._detect_page(ax, elements)
        if page:
            ctx.page_number = page
            ctx.extras["page_hint_source"] = hint
        if total:
            ctx.extras["total_pages"] = total

    def _find_path(self, ax: Any, elements: ElementBundle, ctx: CaptureContext) -> str | None:
        for element in (elements.window, elements.focused, elements.app):
            document = self._first_string(ax, element, "AXDocument", "AXURL")
            path = file_url_to_path(document)
            if path:
                return path
        hinted = ctx.extras.get("document_path")
        return file_url_to_path(hinted) if hinted else None

    def _detect_page(self, ax: Any, elements: ElementBundle) -> tuple[int | None, int | None, str]:
        best: tuple[int, int | None, int | None, str] = (0, None, None, "")

        for element, _depth in ax.walk(
            elements.window, max_depth=8, max_nodes=250, time_budget=0.3
        ):
            role = self._role(ax, element)
            if role not in _TEXTUAL_ROLES:
                continue

            value = ax.string(element, "AXValue")
            label = " ".join(
                filter(
                    None,
                    [
                        ax.string(element, "AXTitle"),
                        ax.string(element, "AXDescription"),
                        ax.string(element, "AXHelp"),
                        ax.string(element, "AXPlaceholderValue"),
                        ax.string(element, "AXRoleDescription"),
                    ],
                )
            )
            haystack = " ".join(filter(None, [value, label]))
            if not haystack:
                continue

            match = _PAGE_OF_RE.search(haystack)
            if match and best[0] < 3:
                best = (3, int(match.group(1)), int(match.group(2)), "page-of-total")
                continue

            match = _PAGE_WORD_RE.search(haystack)
            if match and best[0] < 2:
                best = (2, int(match.group(1)), None, "page-label")
                continue

            if value and label and "page" in label.lower() and best[0] < 1:
                digits = _DIGITS_RE.match(value)
                if digits:
                    best = (1, int(digits.group(1)), None, "numeric-field")

            if best[0] >= 3:
                break

        confidence, page, total, where = best
        if confidence == 0 or not page:
            return None, None, ""
        return page, total, where
