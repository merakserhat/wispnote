package com.wispnote.analyzer.application.note;

import com.wispnote.analyzer.application.note.model.NoteEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteAnalyzerFacade {

    private static final Duration AGGREGATION_WINDOW = Duration.ofSeconds(5);

    private final NoteAggregationWindowPort noteAggregationWindowPort;

    public void analyzeNote(NoteEvent noteEvent) {
        noteAggregationWindowPort.collectIntoWindow(
                noteEvent.note().id(),
                AGGREGATION_WINDOW,
                noteEvent,
                this::runAnalysisPipeline
        );
    }

    private void runAnalysisPipeline(NoteEvent noteEvent) {
        log.info("Analyzing note {} {}", kv("noteId", noteEvent.note().id()), kv("eventKind", noteEvent.kind()));
    }
}
