package com.wispnote.analyzer.adapter.note.rabbit.message;

import com.wispnote.analyzer.adapter.note.converter.NoteEventKindConverter;
import com.wispnote.analyzer.application.note.model.NoteChangedEvent;

import java.time.Instant;
import java.util.UUID;

public record NoteChangedMessage(UUID eventId,
                                 String eventType,
                                 Instant occurredAt,
                                 UUID noteId,
                                 UUID memberId,
                                 UUID sourceId) {

    public NoteChangedEvent toModel() {
        return new NoteChangedEvent(
                eventId,
                NoteEventKindConverter.rabbit.toEnum(eventType),
                occurredAt,
                noteId,
                memberId,
                sourceId
        );
    }
}
