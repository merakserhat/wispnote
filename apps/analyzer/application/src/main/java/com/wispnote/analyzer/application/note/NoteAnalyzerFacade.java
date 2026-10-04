package com.wispnote.analyzer.application.note;

import com.wispnote.analyzer.application.note.model.NoteChangedEvent;
import com.wispnote.analyzer.application.note.port.NotePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteAnalyzerFacade {

    private final NotePort notePort;

    public void analyzeNote(NoteChangedEvent noteChangedEvent) {
        log.info("Analyzing note {} {}", kv("noteId", noteChangedEvent.noteId()), kv("memberId", noteChangedEvent.memberId()));

        var note = notePort.retrieveById(noteChangedEvent.memberId(), noteChangedEvent.noteId());
        log.info("Note retrieved {} {} {}",
                kv("noteId", note.id()),
                kv("sourceId", note.sourceId()),
                kv("selectedText", note.selectedText()));
    }

    public void forgetNote(NoteChangedEvent noteChangedEvent) {
        log.info("Forgetting note {} {}", kv("noteId", noteChangedEvent.noteId()), kv("memberId", noteChangedEvent.memberId()));
    }
}
