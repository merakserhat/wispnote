package com.wispnote.analyzer.application.note.model;

import com.wispnote.analyzer.application.note.enums.NoteEventKind;
import com.wispnote.analyzer.application.note.enums.NoteKind;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class NoteEventTest {

    private static final Long NOTE_ID = 82L;

    @Test
    void mostComplete_ShouldPickTheEnrichment_WhenTheCreationCameFirst() {
        // given
        var created = noteEvent(NoteEventKind.CREATED);
        var enriched = noteEvent(NoteEventKind.ENRICHED);

        // when
        var mostComplete = created.mostComplete(enriched);

        // then
        assertThat(mostComplete).isEqualTo(enriched);
    }

    @Test
    void mostComplete_ShouldKeepTheEnrichment_WhenTheCreationCameSecond() {
        // given
        var enriched = noteEvent(NoteEventKind.ENRICHED);
        var created = noteEvent(NoteEventKind.CREATED);

        // when
        var mostComplete = enriched.mostComplete(created);

        // then the enrichment already carries every field the creation has, so the creation adds nothing
        assertThat(mostComplete).isEqualTo(enriched);
    }

    @Test
    void mostComplete_ShouldKeepTheEventItAlreadyHas_WhenBothAreOfTheSameKind() {
        // given
        var first = noteEvent(NoteEventKind.CREATED);
        var redelivered = noteEvent(NoteEventKind.CREATED);

        // when
        var mostComplete = first.mostComplete(redelivered);

        // then
        assertThat(mostComplete).isEqualTo(first);
    }

    private NoteEvent noteEvent(NoteEventKind kind) {
        var note = new Note(NOTE_ID, 21L, NoteKind.HIGHLIGHT, "selected text", "", "before", "after", "", null, "Google Chrome", "window title", LocalDateTime.now());
        return new NoteEvent(UUID.randomUUID(), kind, 1, LocalDateTime.now(), note, null);
    }
}
