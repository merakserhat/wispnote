package com.wispnote.analyzer.application.note.model;

import java.time.Instant;
import java.util.UUID;

public record Note(UUID id,
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
}
