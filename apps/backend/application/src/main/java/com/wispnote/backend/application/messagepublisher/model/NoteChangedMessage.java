package com.wispnote.backend.application.messagepublisher.model;

import com.wispnote.backend.application.note.model.Note;

import java.time.Instant;
import java.util.UUID;

public record NoteChangedMessage(UUID eventId,
                                 String eventType,
                                 Instant occurredAt,
                                 UUID noteId,
                                 UUID memberId,
                                 UUID sourceId) {

    public static NoteChangedMessage created(Note note) {
        return of("note.created", note);
    }

    public static NoteChangedMessage deleted(Note note) {
        return of("note.deleted", note);
    }

    private static NoteChangedMessage of(String eventType, Note note) {
        return new NoteChangedMessage(UUID.randomUUID(),
                eventType,
                Instant.now(),
                note.id(),
                note.memberId(),
                note.sourceId());
    }
}
