package com.wispnote.analyzer.adapter.note.rabbit.message;

import com.wispnote.analyzer.adapter.note.converter.NoteKindConverter;
import com.wispnote.analyzer.application.note.model.Note;

import java.time.LocalDateTime;

public record NotePayload(Long id,
                          Long sourceId,
                          String kind,
                          String selectedText,
                          String userNote,
                          String contextBefore,
                          String contextAfter,
                          String section,
                          Integer pageNumber,
                          String appName,
                          String windowTitle,
                          LocalDateTime createdAt) {

    public Note toModel() {
        return new Note(
                id,
                sourceId,
                NoteKindConverter.rabbit.toEnum(kind),
                selectedText,
                userNote,
                contextBefore,
                contextAfter,
                section,
                pageNumber,
                appName,
                windowTitle,
                createdAt
        );
    }
}
