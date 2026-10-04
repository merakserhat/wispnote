package com.wispnote.analyzer.adapter.note.mock;

import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.note.port.NotePort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "backend.provider", havingValue = "mock")
public class MockNoteAdapter implements NotePort {

    @Override
    public Note retrieveById(UUID noteId) {
        return new Note(noteId,
                UUID.randomUUID(),
                UUID.randomUUID(),
                "mock selected text",
                "",
                "",
                "",
                null,
                null,
                "Mock window",
                Instant.now());
    }
}
