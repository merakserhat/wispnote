package com.wispnote.backend.application.notegroup.model;

import java.util.UUID;

public record CreateNoteGroupCommand(String title, String description) {

    public NoteGroup toModel(UUID memberId) {
        return new NoteGroup(null,
                memberId,
                title,
                description);
    }
}
