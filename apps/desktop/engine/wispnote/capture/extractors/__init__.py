from __future__ import annotations

from ...models import CaptureContext
from .base import ElementBundle, SourceExtractor
from .browser import BrowserExtractor
from .editor import EditorExtractor
from .generic import GenericExtractor
from .mail import MailExtractor
from .pdf import PdfExtractor

__all__ = [
    "ElementBundle",
    "SourceExtractor",
    "BrowserExtractor",
    "PdfExtractor",
    "MailExtractor",
    "EditorExtractor",
    "GenericExtractor",
    "default_extractors",
    "select_extractor",
]


def default_extractors() -> list[SourceExtractor]:
    return [
        BrowserExtractor(),
        PdfExtractor(),
        MailExtractor(),
        EditorExtractor(),
        GenericExtractor(),
    ]


def select_extractor(
    ctx: CaptureContext, extractors: list[SourceExtractor] | None = None
) -> SourceExtractor:
    for extractor in extractors or default_extractors():
        try:
            if extractor.matches(ctx):
                return extractor
        except Exception:
            continue
    return GenericExtractor()
