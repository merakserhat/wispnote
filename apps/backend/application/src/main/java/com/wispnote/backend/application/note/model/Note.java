package com.wispnote.backend.application.note.model;

import com.wispnote.backend.application.note.enums.EnrichmentStatus;
import com.wispnote.backend.application.note.enums.NoteKind;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record Note(UUID id,
                   UUID memberId,
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
                   Map<String, Object> rawCapture,
                   Instant createdAt) {
}
