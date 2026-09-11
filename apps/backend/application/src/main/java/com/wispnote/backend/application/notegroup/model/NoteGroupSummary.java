package com.wispnote.backend.application.notegroup.model;

public record NoteGroupSummary(NoteGroup noteGroup,
                               Long noteCount) {

    public static NoteGroupSummary empty(NoteGroup noteGroup) {
        return new NoteGroupSummary(noteGroup, 0L);
    }
}
