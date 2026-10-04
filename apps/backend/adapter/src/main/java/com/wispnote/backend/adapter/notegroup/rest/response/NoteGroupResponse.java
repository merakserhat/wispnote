package com.wispnote.backend.adapter.notegroup.rest.response;

import com.wispnote.backend.application.notegroup.model.NoteGroupSummary;

import java.util.UUID;

public record NoteGroupResponse(UUID id,
                                String title,
                                String description,
                                Long noteCount) {

    public static NoteGroupResponse from(NoteGroupSummary summary) {
        var noteGroup = summary.noteGroup();

        return new NoteGroupResponse(noteGroup.id(),
                noteGroup.title(),
                noteGroup.description(),
                summary.noteCount());
    }
}
