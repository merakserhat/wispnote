from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import Any

from ...models import SOURCE_MAIL, CaptureContext
from ...utils import stable_hash
from .. import text_markers
from .base import ElementBundle, SourceExtractor

MESSAGE_CONTENT_IDENTIFIERS = ("_MAIL_MESSAGE_CONTENT", "message_view", "_MAIL_MESSAGE_BODY")

PRUNE_IDENTIFIERS = ("Mail.messageList", "MailboxesOutlineView")
PRUNE_ROLES = ("AXRow", "AXCell", "AXColumn")

HEADER_SINGLETONS = {
    "message.header.content": "header_text",
    "message.mailbox": "mailbox",
    "message.timestamp": "timestamp",
}
HEADER_ADDRESS_PREFIXES = {
    "message.from.": "sender",
    "message.to.": "recipients",
    "message.cc.": "cc",
    "message.bcc.": "bcc",
}

OBJECT_REPLACEMENT = text_markers.OBJECT_REPLACEMENT

MAX_DEPTH = 14
MAX_NODES = 1500
TIME_BUDGET = 0.4


@dataclass
class _Header:
    header_text: str | None = None
    sender: str | None = None
    mailbox: str | None = None
    timestamp: str | None = None
    recipients: list[str] = field(default_factory=list)
    cc: list[str] = field(default_factory=list)
    bcc: list[str] = field(default_factory=list)


class MailExtractor(SourceExtractor):
    name = "mail"

    bundle_ids = {"com.apple.mail"}

    def extract_selection(
        self, ctx: CaptureContext, ax: Any, elements: ElementBundle
    ) -> str | None:
        root, _anchored = self._message_root(ax, elements.window)
        if root is None:
            return None

        web_area = self._find_web_area(ax, root)
        if web_area is not None:
            selection = text_markers.selection(ax, web_area)
            if selection:
                return selection

        return self._native_selection(ax, root)

    def _native_selection(self, ax: Any, root: Any) -> str | None:
        for element, _depth in self._walk(ax, root):
            if self._role(ax, element) not in ("AXTextArea", "AXTextField"):
                continue
            text = ax.string(element, "AXSelectedText")
            if text and text.strip():
                return text
        return None

    def extract(self, ctx: CaptureContext, ax: Any, elements: ElementBundle) -> None:
        ctx.source_kind = SOURCE_MAIL

        root, anchored = self._message_root(ax, elements.window)
        if root is None:
            ctx.add_error("mail: no window to read")
            self._fallback_identity(ctx)
            return
        if not anchored:
            ctx.add_error("mail: message container not found; read the whole window")

        header = self._read_header(ax, root)
        subject = self._subject(header.header_text, ctx.window_title)

        ctx.source_title = subject or ctx.app_name
        self._set(ctx, "sender", header.sender)
        self._set(ctx, "mailbox", header.mailbox)
        self._set(ctx, "timestamp", header.timestamp)
        self._set(ctx, "recipients", header.recipients)
        self._set(ctx, "cc", header.cc)
        self._set(ctx, "bcc", header.bcc)

        self._record_body_length(ax, root, ctx)

        if subject or header.sender or header.timestamp:
            ctx.source_key = "mail:" + stable_hash(
                header.sender or "", header.timestamp or "", subject or ""
            )
        else:
            ctx.add_error("mail: no message header found")
            self._fallback_identity(ctx)

    def _record_body_length(self, ax: Any, root: Any, ctx: CaptureContext) -> None:
        web_area = self._find_web_area(ax, root)
        if web_area is None:
            return

        body = text_markers.document(ax, web_area)
        if body is None:
            return

        ctx.extras["body_length"] = len(body)
        ctx.extras["body_source"] = "text_marker"

    def _fallback_identity(self, ctx: CaptureContext) -> None:
        ctx.source_key = f"app:{ctx.bundle_id or ctx.app_name or 'com.apple.mail'}"
        if not ctx.source_title:
            ctx.source_title = ctx.app_name or "Mail"

    def _read_header(self, ax: Any, root: Any) -> _Header:
        header = _Header()

        for element, _depth in self._walk(ax, root):
            identifier = ax.string(element, "AXIdentifier") or ""
            if not identifier.startswith("message"):
                continue

            slot = HEADER_SINGLETONS.get(identifier)
            if slot is not None:
                value = ax.string(element, "AXValue")
                if not value:
                    continue
                if slot == "header_text":
                    header.header_text = value
                elif slot == "mailbox":
                    header.mailbox = self._clean(value)
                else:
                    header.timestamp = self._clean(value)
                continue

            for prefix, address_slot in HEADER_ADDRESS_PREFIXES.items():
                if not identifier.startswith(prefix):
                    continue
                value = self._clean(ax.string(element, "AXValue") or "")
                if not value:
                    break
                if address_slot == "sender":
                    if header.sender is None:
                        header.sender = value
                else:
                    getattr(header, address_slot).append(value)
                break

        return header

    @staticmethod
    def _clean(value: str) -> str:
        return value.replace(OBJECT_REPLACEMENT, "").strip()

    @classmethod
    def _subject(cls, header_text: str | None, window_title: str | None) -> str | None:
        if header_text:
            for line in header_text.splitlines():
                line = cls._clean(line)
                if line and not line.startswith(("To:", "Cc:", "Bcc:", "From:")):
                    return line

        if window_title:
            return window_title.rsplit(" — ", 1)[0].strip() or None
        return None

    def _message_root(self, ax: Any, window: Any) -> tuple[Any, bool]:
        if window is None:
            return None, False
        for element, _depth in self._walk(ax, window):
            if (ax.string(element, "AXIdentifier") or "") in MESSAGE_CONTENT_IDENTIFIERS:
                return element, True
        return window, False

    def _find_web_area(self, ax: Any, root: Any) -> Any | None:
        for element, _depth in self._walk(ax, root):
            if self._role(ax, element) == "AXWebArea":
                return element
        return None

    def _walk(self, ax: Any, root: Any) -> Iterator[tuple[Any, int]]:
        return ax.walk(
            root,
            max_depth=MAX_DEPTH,
            max_nodes=MAX_NODES,
            time_budget=TIME_BUDGET,
            prune=lambda element: self._is_pruned(ax, element),
        )

    def _is_pruned(self, ax: Any, element: Any) -> bool:
        return (ax.string(element, "AXIdentifier") or "") in PRUNE_IDENTIFIERS or self._role(
            ax, element
        ) in PRUNE_ROLES

    @staticmethod
    def _set(ctx: CaptureContext, key: str, value: Any) -> None:
        if value:
            ctx.extras[key] = value
