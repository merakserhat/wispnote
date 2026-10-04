from __future__ import annotations

import os
import re
from typing import Any

from ...models import SOURCE_FILE, CaptureContext
from ...utils import clean_window_title, file_url_to_path
from .base import ElementBundle, SourceExtractor

_TITLE_SPLIT_RE = re.compile(r"\s+[—–-]\s+")
_DIRTY_PREFIX_RE = re.compile(r"^[●•*]\s*")

_MAX_LINE = 10_000_000


class EditorExtractor(SourceExtractor):
    name = "editor"

    bundle_ids = {
        "com.microsoft.vscode",
        "com.microsoft.vscodeinsiders",
        "com.visualstudio.code.oss",
        "com.todesktop.230313mzl4w4u92",
        "dev.zed.zed",
        "com.apple.dt.xcode",
        "com.sublimetext.4",
        "com.sublimetext.3",
        "com.github.atom",
        "com.panic.nova",
        "abnerworks.typora",
        "md.obsidian",
    }
    bundle_prefixes = ("com.jetbrains.", "com.google.android.studio")
    app_name_hints = ("visual studio code", "cursor", "xcode", "sublime", "zed", "nova", "obsidian")

    def extract(self, ctx: CaptureContext, ax: Any, elements: ElementBundle) -> None:
        path = self._find_path(ax, elements)
        ctx.source_kind = SOURCE_FILE
        ctx.file_path = path

        if path:
            ctx.source_key = f"file:{path}"
            ctx.source_title = os.path.basename(path)
            ctx.extras["project"] = os.path.basename(os.path.dirname(path))
        else:
            name = self._filename_from_title(ctx)
            ctx.source_key = f"editor:{ctx.bundle_id}:{name or ctx.app_name}"
            ctx.source_title = name or ctx.app_name
            if not name:
                ctx.add_error("editor: could not determine file")

        line = ax.number(elements.focused, "AXInsertionPointLineNumber")
        if line is not None and 0 <= line < _MAX_LINE:
            ctx.line_number = line + 1

    def _find_path(self, ax: Any, elements: ElementBundle) -> str | None:
        for element in (elements.window, elements.focused):
            document = self._first_string(ax, element, "AXDocument", "AXURL")
            path = file_url_to_path(document)
            if path:
                return path
        return None

    def _filename_from_title(self, ctx: CaptureContext) -> str | None:
        title = clean_window_title(ctx.window_title, ctx.app_name)
        if not title:
            return None
        first = _TITLE_SPLIT_RE.split(title)[0]
        return _DIRTY_PREFIX_RE.sub("", first).strip() or None
