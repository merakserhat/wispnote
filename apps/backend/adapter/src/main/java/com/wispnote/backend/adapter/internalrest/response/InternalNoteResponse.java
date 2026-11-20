package com.wispnote.backend.adapter.internalrest.response;

import com.wispnote.backend.application.note.model.Note;
import com.wispnote.backend.application.source.model.Source;

import java.time.Instant;
import java.util.UUID;

public record InternalNoteResponse(UUID id,
                                   UUID memberId,
                                   UUID sourceId,
                                   String selectedText,
                                   String userNote,
                                   String contextBefore,
                                   String contextAfter,
                                   String section,
                                   Integer pageNumber,
                                   String windowTitle,
                                   Instant createdAt,
                                   InternalNoteSourceResponse source) {

    public static InternalNoteResponse from(Note note, Source source) {
        return new InternalNoteResponse(note.id(),
                note.memberId(),
                note.sourceId(),
                note.selectedText(),
                note.userNote(),
                note.contextBefore(),
                note.contextAfter(),
                note.section(),
                note.pageNumber(),
                note.windowTitle(),
                note.createdAt(),
                InternalNoteSourceResponse.from(source));
    }
}
