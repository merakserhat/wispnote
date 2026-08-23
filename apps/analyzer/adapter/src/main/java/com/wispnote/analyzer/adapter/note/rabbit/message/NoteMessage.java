package com.wispnote.analyzer.adapter.note.rabbit.message;

import com.wispnote.analyzer.adapter.note.converter.NoteEventKindConverter;
import com.wispnote.analyzer.application.note.model.NoteEvent;

import java.time.LocalDateTime;
import java.util.UUID;

import static java.util.Objects.nonNull;

/**
 * Creation and enrichment publish an identical payload shape, so both listeners bind to this one record and
 * the payload tells us apart which is which through {@code eventType}.
 */
public record NoteMessage(UUID eventId,
                          String eventType,
                          Integer schemaVersion,
                          LocalDateTime occurredAt,
                          NotePayload note,
                          SourcePayload source) {

    public NoteEvent toModel() {
        return new NoteEvent(
                eventId,
                NoteEventKindConverter.rabbit.toEnum(eventType),
                schemaVersion,
                occurredAt,
                nonNull(note) ? note.toModel() : null,
                nonNull(source) ? source.toModel() : null
        );
    }
}
