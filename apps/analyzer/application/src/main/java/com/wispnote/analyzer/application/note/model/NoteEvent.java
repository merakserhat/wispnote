package com.wispnote.analyzer.application.note.model;

import com.wispnote.analyzer.application.note.enums.NoteEventKind;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * One note as it arrived on either queue. Creation and enrichment carry the exact same fields, so they share
 * this single model and differ only in {@link #kind()}.
 */
public record NoteEvent(UUID eventId,
                        NoteEventKind kind,
                        Integer schemaVersion,
                        LocalDateTime occurredAt,
                        Note note,
                        Source source) {

    /**
     * Picks the event that carries the most context. The two queues are independent, so an enrichment can
     * overtake its own creation; ranking by kind rather than by arrival keeps the outcome the same either way.
     */
    public NoteEvent mostComplete(NoteEvent other) {
        return other.kind().supersedes(kind) ? other : this;
    }
}
