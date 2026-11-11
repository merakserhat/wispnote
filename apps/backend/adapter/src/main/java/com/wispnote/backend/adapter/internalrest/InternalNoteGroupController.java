package com.wispnote.backend.adapter.internalrest;

import com.wispnote.backend.adapter.internalrest.annotation.InternalRestController;
import com.wispnote.backend.adapter.internalrest.response.InternalNoteGroupResponse;
import com.wispnote.backend.application.notegroup.NoteGroupFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.UUID;

@InternalRestController
@RequiredArgsConstructor
@RequestMapping("/internal/v1")
public class InternalNoteGroupController {

    private final NoteGroupFacade noteGroupFacade;

    @GetMapping("/members/{memberId}/note-groups")
    public List<InternalNoteGroupResponse> listNoteGroups(@PathVariable UUID memberId) {
        return noteGroupFacade.listAll(memberId).stream()
                .map(InternalNoteGroupResponse::from)
                .toList();
    }

    @PutMapping("/members/{memberId}/note-groups/{noteGroupId}/notes/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addNoteToGroup(@PathVariable UUID memberId,
                               @PathVariable UUID noteGroupId,
                               @PathVariable UUID noteId) {
        noteGroupFacade.addNote(memberId, noteGroupId, noteId);
    }
}
