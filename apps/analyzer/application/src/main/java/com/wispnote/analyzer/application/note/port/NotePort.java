package com.wispnote.analyzer.application.note.port;

import com.wispnote.analyzer.application.note.model.Note;

import java.util.UUID;

public interface NotePort {
    Note retrieveById(UUID memberId, UUID noteId);
}
