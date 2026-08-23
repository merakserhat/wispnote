package com.wispnote.analyzer.application.note.enums;

/**
 * Which flavour of note event reached us. The enrichment repeats every field the creation carries and fills
 * in the context the capture could not read off the screen, so it always outranks the creation.
 */
public enum NoteEventKind {
    CREATED(0),
    ENRICHED(1);

    private final int precedence;

    NoteEventKind(int precedence) {
        this.precedence = precedence;
    }

    public boolean supersedes(NoteEventKind other) {
        return precedence > other.precedence;
    }
}
