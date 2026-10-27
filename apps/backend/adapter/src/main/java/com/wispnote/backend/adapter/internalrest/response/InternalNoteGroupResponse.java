package com.wispnote.backend.adapter.internalrest.response;

import com.wispnote.backend.application.notegroup.model.NoteGroup;

import java.util.UUID;

public record InternalNoteGroupResponse(UUID id,
                                        String title,
                                        String description) {

    public static InternalNoteGroupResponse from(NoteGroup noteGroup) {
        return new InternalNoteGroupResponse(noteGroup.id(), noteGroup.title(), noteGroup.description());
    }
}
