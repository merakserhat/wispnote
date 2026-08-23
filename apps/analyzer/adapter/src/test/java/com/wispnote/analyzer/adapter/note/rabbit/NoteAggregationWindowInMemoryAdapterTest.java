package com.wispnote.analyzer.adapter.note.rabbit;

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
import org.springframework.scheduling.TaskScheduler;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NoteAggregationWindowInMemoryAdapterTest {

    private static final Long NOTE_ID = 82L;
    private static final Duration WINDOW_TIMEOUT = Duration.ofSeconds(5);

    @InjectMocks
    private NoteAggregationWindowInMemoryAdapter noteAggregationWindowInMemoryAdapter;

    @Mock
    private TaskScheduler analyzerTaskScheduler;

    private final List<NoteEvent> analyzed = new ArrayList<>();

    @Test
    void collectIntoWindow_ShouldAnalyzeTheEnrichment_WhenTheCreationOpenedTheWindow() {
        // given
        collect(noteEvent(NoteEventKind.CREATED));
        var enriched = noteEvent(NoteEventKind.ENRICHED);
        collect(enriched);

        // when
        closeWindow();

        // then
        assertThat(analyzed).containsExactly(enriched);
    }

    @Test
    void collectIntoWindow_ShouldAnalyzeTheEnrichment_WhenTheEnrichmentOpenedTheWindow() {
        // given the enrichment overtook its own creation on the way out of the broker
        var enriched = noteEvent(NoteEventKind.ENRICHED);
        collect(enriched);
        collect(noteEvent(NoteEventKind.CREATED));

        // when
        closeWindow();

        // then the late creation is ignored, it carries nothing the enrichment does not already have
        assertThat(analyzed).containsExactly(enriched);
    }

    @Test
    void collectIntoWindow_ShouldAnalyzeTheCreation_WhenNoEnrichmentArrivesBeforeTheWindowCloses() {
        // given
        var created = noteEvent(NoteEventKind.CREATED);
        collect(created);

        // when
        closeWindow();

        // then
        assertThat(analyzed).containsExactly(created);
    }

    @Test
    void collectIntoWindow_ShouldStartTheTimerOnlyOnce_SoThatTheSecondEventDoesNotExtendTheWindow() {
        // given
        collect(noteEvent(NoteEventKind.CREATED));

        // when
        collect(noteEvent(NoteEventKind.ENRICHED));

        // then
        verify(analyzerTaskScheduler, times(1)).schedule(any(Runnable.class), any(Instant.class));
    }

    @Test
    void collectIntoWindow_ShouldAnalyzeTheNoteOnlyOnce_WhenTheWindowClosesTwice() {
        // given
        collect(noteEvent(NoteEventKind.CREATED));
        closeWindow();
        analyzed.clear();

        // when
        closeWindow();

        // then
        assertThat(analyzed).isEmpty();
    }

    @Test
    void collectIntoWindow_ShouldOpenAFreshWindow_WhenAnEventArrivesAfterTheWindowClosed() {
        // given
        collect(noteEvent(NoteEventKind.CREATED));
        closeWindow();

        // when a late enrichment finds no open window
        var lateEnrichment = noteEvent(NoteEventKind.ENRICHED);
        collect(lateEnrichment);

        // then it gets a window of its own rather than being dropped
        verify(analyzerTaskScheduler, times(2)).schedule(any(Runnable.class), any(Instant.class));
        closeLastWindow();
        assertThat(analyzed).last().isEqualTo(lateEnrichment);
    }

    private void collect(NoteEvent noteEvent) {
        noteAggregationWindowInMemoryAdapter.collectIntoWindow(NOTE_ID, WINDOW_TIMEOUT, noteEvent, analyzed::add);
    }

    private void closeWindow() {
        scheduledWindowClosers().getFirst().run();
    }

    private void closeLastWindow() {
        scheduledWindowClosers().getLast().run();
    }

    private List<Runnable> scheduledWindowClosers() {
        var windowCloserCaptor = ArgumentCaptor.forClass(Runnable.class);
        verify(analyzerTaskScheduler, atLeastOnce()).schedule(windowCloserCaptor.capture(), any(Instant.class));
        return windowCloserCaptor.getAllValues();
    }

    private NoteEvent noteEvent(NoteEventKind kind) {
        var note = new Note(NOTE_ID, 21L, NoteKind.HIGHLIGHT, "selected text", "", "before", "after", "", null, "Google Chrome", "window title", LocalDateTime.now());
        return new NoteEvent(UUID.randomUUID(), kind, 1, LocalDateTime.now(), note, null);
    }
}
