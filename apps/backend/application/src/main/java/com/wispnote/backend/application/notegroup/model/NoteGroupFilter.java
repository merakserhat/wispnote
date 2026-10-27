package com.wispnote.backend.application.notegroup.model;

public record NoteGroupFilter(String search) {

    public static NoteGroupFilter empty() {
        return new NoteGroupFilter(null);
    }
}
