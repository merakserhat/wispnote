package com.wispnote.analyzer.adapter.backend.response;

import com.wispnote.analyzer.application.notegroup.model.NoteGroup;

import java.util.UUID;

public record NoteGroupResponse(UUID id,
                                String title,
                                String description) {

    public NoteGroup toModel() {
        return new NoteGroup(id, title, description);
    }
}
