package com.wispnote.backend.application.note.model;

import com.wispnote.backend.application.note.enums.NoteKind;

import java.util.UUID;

public record NoteFilter(UUID sourceId, UUID noteGroupId, NoteKind kind, String search) {
}
