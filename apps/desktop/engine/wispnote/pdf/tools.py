from __future__ import annotations

import contextlib
import os
from collections.abc import Iterable
from typing import Any

from ..utils import normalize_whitespace, stable_hash, truncate

try:
    import pymupdf

    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

MAX_CONTEXT_CHARS = 600

_MARKUP_SUBTYPES = {"Highlight", "Underline", "Squiggly", "StrikeOut"}
_TEXT_SUBTYPES = {"Text", "FreeText", "Note"}


class PdfTools:
    @property
    def available(self) -> bool:
        return PDF_AVAILABLE

    def document_info(self, path: str) -> dict[str, Any]:
        if not self.available or not path or not os.path.exists(path):
            return {}
        try:
            with pymupdf.open(path) as document:
                meta = document.metadata or {}
                toc = []
                try:
                    toc = [
                        {"level": level, "title": normalize_whitespace(title), "page": page}
                        for level, title, page in (document.get_toc() or [])
                    ]
                except Exception:
                    toc = []
                return {
                    "pdf_title": normalize_whitespace(meta.get("title") or ""),
                    "pdf_author": normalize_whitespace(meta.get("author") or ""),
                    "page_count": document.page_count,
                    "toc": toc[:500],
                    "file_size": os.path.getsize(path),
                }
        except Exception:
            return {}

    def locate(
        self,
        path: str,
        text: str,
        *,
        page_hint: int | None = None,
        max_pages: int = 2000,
    ) -> dict[str, Any]:
        result: dict[str, Any] = {"located": False}
        if not self.available or not path or not os.path.exists(path):
            return result

        needle = normalize_whitespace(text)
        if len(needle) < 8:
            return result
        probe = needle[:120]

        try:
            with pymupdf.open(path) as document:
                result["total_pages"] = document.page_count
                toc = self._toc(document)

                for page_index in self._page_order(document.page_count, page_hint, max_pages):
                    page_text = self._page_text(document, page_index)
                    if not page_text:
                        continue
                    position = page_text.find(probe)
                    if position < 0:
                        continue

                    end = position + len(needle)
                    if end > len(page_text):
                        end = position + len(probe)

                    result.update(
                        {
                            "located": True,
                            "page_number": page_index + 1,
                            "context_before": truncate(
                                page_text[max(0, position - MAX_CONTEXT_CHARS) : position],
                                MAX_CONTEXT_CHARS,
                            ),
                            "context_after": truncate(
                                page_text[end : end + MAX_CONTEXT_CHARS], MAX_CONTEXT_CHARS
                            ),
                            "section": self._section_for_page(toc, page_index + 1),
                        }
                    )
                    return result
        except Exception as exc:
            result["error"] = str(exc)
        return result

    def import_annotations(self, path: str) -> list[dict[str, Any]]:
        if not self.available or not path or not os.path.exists(path):
            return []

        found: list[dict[str, Any]] = []
        try:
            with pymupdf.open(path) as document:
                toc = self._toc(document)
                for page_index in range(document.page_count):
                    page = document.load_page(page_index)
                    try:
                        annotations = list(page.annots() or [])
                    except Exception:
                        continue

                    for order, annotation in enumerate(annotations):
                        entry = self._annotation_to_dict(page, annotation, page_index, order, toc)
                        if entry:
                            found.append(entry)
        except Exception:
            return found
        return found

    def _annotation_to_dict(
        self, page: Any, annotation: Any, page_index: int, order: int, toc: list[dict[str, Any]]
    ) -> dict[str, Any] | None:
        try:
            subtype = annotation.type[1] if annotation.type else ""
        except Exception:
            return None

        info = {}
        with contextlib.suppress(Exception):
            info = annotation.info or {}

        comment = normalize_whitespace(info.get("content") or "")
        highlighted = ""

        if subtype in _MARKUP_SUBTYPES:
            highlighted = self._markup_text(page, annotation)
        elif subtype in _TEXT_SUBTYPES:
            highlighted = ""
        else:
            return None

        if not highlighted and not comment:
            return None

        try:
            rect = annotation.rect
            geometry = [round(float(v), 1) for v in (rect.x0, rect.y0, rect.x1, rect.y1)]
        except Exception:
            geometry = []

        return {
            "page_number": page_index + 1,
            "subtype": subtype,
            "text": highlighted,
            "comment": comment,
            "author": normalize_whitespace(info.get("title") or ""),
            "modified": info.get("modDate") or "",
            "rect": geometry,
            "section": self._section_for_page(toc, page_index + 1),
            "external_id": stable_hash(page_index, subtype, order, geometry, highlighted[:200]),
        }

    @staticmethod
    def _markup_text(page: Any, annotation: Any) -> str:
        chunks: list[str] = []
        vertices = None
        try:
            vertices = annotation.vertices
        except Exception:
            vertices = None

        try:
            if vertices and len(vertices) % 4 == 0:
                for index in range(0, len(vertices), 4):
                    quad = pymupdf.Quad(vertices[index : index + 4])
                    chunk = page.get_textbox(quad.rect)
                    if chunk:
                        chunks.append(chunk)
            else:
                chunk = page.get_textbox(annotation.rect)
                if chunk:
                    chunks.append(chunk)
        except Exception:
            return ""

        return normalize_whitespace(" ".join(chunks))

    @staticmethod
    def _page_text(document: Any, page_index: int) -> str:
        try:
            return normalize_whitespace(document.load_page(page_index).get_text("text"))
        except Exception:
            return ""

    @staticmethod
    def _page_order(page_count: int, hint: int | None, max_pages: int) -> Iterable[int]:
        pages = list(range(min(page_count, max_pages)))
        if not hint:
            return pages

        centre = max(0, min(page_count - 1, hint - 1))
        nearby = [p for p in range(centre - 3, centre + 4) if 0 <= p < page_count]
        seen = set(nearby)
        return nearby + [p for p in pages if p not in seen]

    @staticmethod
    def _toc(document: Any) -> list[dict[str, Any]]:
        try:
            return [
                {"level": level, "title": normalize_whitespace(title), "page": page}
                for level, title, page in (document.get_toc() or [])
            ]
        except Exception:
            return []

    @staticmethod
    def _section_for_page(toc: list[dict[str, Any]], page_number: int) -> str:
        best = ""
        for entry in toc:
            page = entry.get("page") or 0
            if 0 < page <= page_number:
                best = entry.get("title") or best
            elif page > page_number:
                break
        return truncate(best, 200)
