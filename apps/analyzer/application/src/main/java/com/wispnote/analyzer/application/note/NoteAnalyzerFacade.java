package com.wispnote.analyzer.application.note;

import com.wispnote.analyzer.application.note.model.NoteChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteAnalyzerFacade {

    public void analyzeNote(NoteChangedEvent noteChangedEvent) {
        log.info("Analyzing note {} {}", kv("noteId", noteChangedEvent.noteId()), kv("memberId", noteChangedEvent.memberId()));
    }

    public void forgetNote(NoteChangedEvent noteChangedEvent) {
        log.info("Forgetting note {} {}", kv("noteId", noteChangedEvent.noteId()), kv("memberId", noteChangedEvent.memberId()));
    }
}
