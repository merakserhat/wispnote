package com.wispnote.analyzer.application.note.model;

import com.wispnote.analyzer.application.note.enums.NoteEventKind;

import java.time.Instant;
import java.util.UUID;

public record NoteChangedEvent(UUID eventId,
                               NoteEventKind kind,
                               Instant occurredAt,
                               UUID noteId,
                               UUID memberId,
                               UUID sourceId) {
}
