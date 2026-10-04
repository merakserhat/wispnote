package com.wispnote.analyzer.adapter.backend.response;

import com.wispnote.analyzer.application.note.model.Note;

import java.time.Instant;
import java.util.UUID;

public record NoteResponse(UUID id,
                           UUID memberId,
                           UUID sourceId,
                           String selectedText,
                           String userNote,
                           String contextBefore,
                           String contextAfter,
                           String section,
                           Integer pageNumber,
                           String windowTitle,
                           Instant createdAt) {

    public Note toModel() {
        return new Note(id, memberId, sourceId, selectedText, userNote, contextBefore, contextAfter,
                section, pageNumber, windowTitle, createdAt);
    }
}
