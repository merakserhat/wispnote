package com.wispnote.analyzer.adapter.note.rabbit;

import com.wispnote.analyzer.application.note.NoteAggregationWindowPort;
import com.wispnote.analyzer.application.note.model.NoteEvent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;

import static net.logstash.logback.argument.StructuredArguments.kv;


@Component
@Slf4j
@AllArgsConstructor
public class NoteAggregationWindowInMemoryAdapter implements NoteAggregationWindowPort {

    private final ConcurrentHashMap<Long, NoteEvent> noteWindowMap = new ConcurrentHashMap<>();

    private final TaskScheduler analyzerTaskScheduler;

    @Override
    public void collectIntoWindow(Long noteId, Duration windowTimeout, NoteEvent noteEvent, Consumer<NoteEvent> onWindowClose) {
        noteWindowMap.compute(noteId, (id, collected) -> {
            if (collected == null) {
                log.info("Opening the note aggregation window {} {}", kv("noteId", noteId), kv("eventKind", noteEvent.kind()));
                analyzerTaskScheduler.schedule(() -> closeWindow(noteId, onWindowClose), Instant.now().plus(windowTimeout));
                return noteEvent;
            }

            log.info("Collecting into the open note aggregation window {} {}", kv("noteId", noteId), kv("eventKind", noteEvent.kind()));
            return collected.mostComplete(noteEvent);
        });
    }

    private void closeWindow(Long noteId, Consumer<NoteEvent> onWindowClose) {
        var collected = noteWindowMap.remove(noteId);
        if (collected == null) {
            log.warn("Note aggregation window vanished before it could be closed {}", kv("noteId", noteId));
            return;
        }

        log.info("Note aggregation window closed {} {}", kv("noteId", noteId), kv("eventKind", collected.kind()));
        onWindowClose.accept(collected);
    }
}
