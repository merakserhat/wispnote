from __future__ import annotations

from typing import Any

from ...models import SOURCE_APP, CaptureContext
from ...utils import clean_window_title, file_url_to_path
from .base import ElementBundle, SourceExtractor

_DOCUMENT_APPS = {
    "com.apple.ibooks",
    "com.apple.books",
    "com.amazon.lassen",
    "com.microsoft.word",
    "com.apple.iwork.pages",
    "com.apple.notes",
    "notion.id",
    "com.electron.logseq",
    "md.obsidian",
    "com.evernote.evernote",
    "com.apple.textedit",
    "com.goodnotes.mac",
    "com.flexibits.craft",
}


class GenericExtractor(SourceExtractor):
    name = "generic"

    def matches(self, ctx: CaptureContext) -> bool:
        return True

    def extract(self, ctx: CaptureContext, ax: Any, elements: ElementBundle) -> None:
        ctx.source_kind = SOURCE_APP

        document = self._first_string(ax, elements.window, "AXDocument")
        path = file_url_to_path(document)
        if path:
            ctx.file_path = path

        title = clean_window_title(ctx.window_title, ctx.app_name)
        bundle = (ctx.bundle_id or "").lower()

        if bundle in _DOCUMENT_APPS and title:
            ctx.source_key = f"doc:{bundle}:{title}"
            ctx.source_title = title
            ctx.extras["document_app"] = True
        else:
            ctx.source_key = f"app:{bundle or ctx.app_name}"
            ctx.source_title = ctx.app_name or title or "Unknown app"
            if title:
                ctx.extras["window_title"] = title
