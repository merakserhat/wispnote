package com.wispnote.analyzer.application.note;

import com.wispnote.analyzer.application.note.enums.NoteEventKind;
import com.wispnote.analyzer.application.note.enums.NoteKind;
import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.note.model.NoteEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.function.Consumer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class NoteAnalyzerFacadeTest {

    private static final Long NOTE_ID = 82L;
    private static final Duration AGGREGATION_WINDOW = Duration.ofSeconds(5);

    @InjectMocks
    private NoteAnalyzerFacade noteAnalyzerFacade;

    @Mock
    private NoteAggregationWindowPort noteAggregationWindowPort;

    @Test
    void analyzeNote_ShouldCollectTheCreatedEventIntoAFiveSecondWindow() {
        // given
        var noteEvent = noteEvent(NoteEventKind.CREATED);

        // when
        noteAnalyzerFacade.analyzeNote(noteEvent);

        // then
        var onWindowCloseCaptor = windowCloseCallbackCaptor();
        verify(noteAggregationWindowPort).collectIntoWindow(eq(NOTE_ID), eq(AGGREGATION_WINDOW), eq(noteEvent), onWindowCloseCaptor.capture());
        assertThat(onWindowCloseCaptor.getValue()).isNotNull();
    }

    @Test
    void analyzeNote_ShouldCollectTheEnrichedEventIntoTheSameWindow_SoThatArrivalOrderDoesNotMatter() {
        // given
        var noteEvent = noteEvent(NoteEventKind.ENRICHED);

        // when
        noteAnalyzerFacade.analyzeNote(noteEvent);

        // then an enrichment is not analyzed on arrival either, it goes through the very same window
        verify(noteAggregationWindowPort).collectIntoWindow(eq(NOTE_ID), eq(AGGREGATION_WINDOW), eq(noteEvent), any());
        verifyNoMoreInteractions(noteAggregationWindowPort);
    }

    @Test
    void analyzeNote_ShouldRunThePipeline_WhenTheWindowCloses() {
        // given
        var noteEvent = noteEvent(NoteEventKind.CREATED);
        noteAnalyzerFacade.analyzeNote(noteEvent);

        var onWindowCloseCaptor = windowCloseCallbackCaptor();
        verify(noteAggregationWindowPort).collectIntoWindow(eq(NOTE_ID), eq(AGGREGATION_WINDOW), eq(noteEvent), onWindowCloseCaptor.capture());

        // when
        onWindowCloseCaptor.getValue().accept(noteEvent);

        // then the callback analyzes on its own, it must not touch the window again
        verifyNoMoreInteractions(noteAggregationWindowPort);
    }

    @SuppressWarnings("unchecked")
    private ArgumentCaptor<Consumer<NoteEvent>> windowCloseCallbackCaptor() {
        return ArgumentCaptor.forClass(Consumer.class);
    }

    private NoteEvent noteEvent(NoteEventKind kind) {
        return new NoteEvent(UUID.randomUUID(), kind, 1, LocalDateTime.now(), note(), null);
    }

    private Note note() {
        return new Note(NOTE_ID, 21L, NoteKind.HIGHLIGHT, "selected text", "", "before", "after", "", null, "Google Chrome", "window title", LocalDateTime.now());
    }
}
