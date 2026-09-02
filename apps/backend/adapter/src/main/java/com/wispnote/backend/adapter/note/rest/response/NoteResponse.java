package com.wispnote.backend.adapter.note.rest.response;

import com.wispnote.backend.application.note.enums.EnrichmentStatus;
import com.wispnote.backend.application.note.enums.NoteKind;
import com.wispnote.backend.application.note.model.Note;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record NoteResponse(UUID id,
                           UUID sourceId,
                           NoteKind kind,
                           String selectedText,
                           String userNote,
                           String contextBefore,
                           String contextAfter,
                           String section,
                           Integer pageNumber,
                           Map<String, Object> location,
                           String windowTitle,
                           EnrichmentStatus enrichmentStatus,
                           Instant createdAt) {

    public static NoteResponse from(Note note) {
        return new NoteResponse(note.id(),
                note.sourceId(),
                note.kind(),
                note.selectedText(),
                note.userNote(),
                note.contextBefore(),
                note.contextAfter(),
                note.section(),
                note.pageNumber(),
                note.location(),
                note.windowTitle(),
                note.enrichmentStatus(),
                note.createdAt());
    }
}
