package com.wispnote.analyzer.application.note.model;

import com.wispnote.analyzer.application.note.enums.NoteKind;

import java.time.LocalDateTime;

public record Note(Long id,
                   Long sourceId,
                   NoteKind kind,
                   String selectedText,
                   String userNote,
                   String contextBefore,
                   String contextAfter,
                   String section,
                   Integer pageNumber,
                   String appName,
                   String windowTitle,
                   LocalDateTime createdAt) {
}
