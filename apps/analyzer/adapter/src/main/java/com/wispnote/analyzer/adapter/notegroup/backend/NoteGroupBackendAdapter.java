package com.wispnote.analyzer.adapter.notegroup.backend;

import com.wispnote.analyzer.adapter.backend.BackendRestClient;
import com.wispnote.analyzer.adapter.backend.response.NoteGroupResponse;
import com.wispnote.analyzer.application.notegroup.model.NoteGroups;
import com.wispnote.analyzer.application.notegroup.port.NoteGroupPort;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "backend.provider", havingValue = "rest", matchIfMissing = true)
public class NoteGroupBackendAdapter implements NoteGroupPort {

    private final BackendRestClient backendRestClient;

    @Override
    public NoteGroups findAllByMemberId(UUID memberId) {
        var groups = backendRestClient.listNoteGroups(memberId).result().stream()
                .map(NoteGroupResponse::toModel)
                .toList();
        return new NoteGroups(groups);
    }

    @Override
    public void addNote(UUID memberId, UUID noteGroupId, UUID noteId) {
        backendRestClient.addNoteToGroup(memberId, noteGroupId, noteId);
    }
}
