package com.wispnote.analyzer.adapter.note.backend;

import com.wispnote.analyzer.adapter.backend.BackendRestClient;
import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.note.port.NotePort;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "backend.provider", havingValue = "rest", matchIfMissing = true)
public class NoteBackendAdapter implements NotePort {

    private final BackendRestClient backendRestClient;

    @Override
    public Note retrieveById(UUID noteId) {
        return backendRestClient.retrieveNote(noteId).result().toModel();
    }
}
