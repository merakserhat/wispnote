package com.wispnote.backend.application.note.model;

import com.wispnote.backend.application.note.enums.EnrichmentStatus;
import com.wispnote.backend.application.note.enums.NoteKind;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public record NoteCapture(SourceCapture source,
                          NoteKind kind,
                          String selectedText,
                          String userNote,
                          String contextBefore,
                          String contextAfter,
                          String section,
                          Integer pageNumber,
                          Map<String, Object> location,
                          String windowTitle,
                          Map<String, Object> rawCapture) {

    public Note toNote(UUID memberId, UUID sourceId) {
        return new Note(null,
                memberId,
                sourceId,
                orDefault(this.kind(), NoteKind.HIGHLIGHT),
                orEmpty(this.selectedText()),
                orEmpty(this.userNote()),
                orEmpty(this.contextBefore()),
                orEmpty(this.contextAfter()),
                this.section(),
                this.pageNumber(),
                orEmptyMap(this.location()),
                this.windowTitle(),
                EnrichmentStatus.PENDING,
                orEmptyMap(this.rawCapture()),
                null);
    }

    private static <T> T orDefault(T value, T fallback) {
        return value == null ? fallback : value;
    }

    private static String orEmpty(String value) {
        return value == null ? "" : value;
    }

    private static Map<String, Object> orEmptyMap(Map<String, Object> value) {
        return value == null ? new HashMap<>() : value;
    }
}
