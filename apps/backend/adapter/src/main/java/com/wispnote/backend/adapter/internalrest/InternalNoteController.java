package com.wispnote.backend.adapter.internalrest;

import com.wispnote.backend.adapter.internalrest.annotation.InternalRestController;
import com.wispnote.backend.adapter.internalrest.response.InternalNoteResponse;
import com.wispnote.backend.application.note.NoteFacade;
import com.wispnote.backend.application.source.SourceFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@InternalRestController
@RequiredArgsConstructor
@RequestMapping("/internal/v1")
public class InternalNoteController {

    private final NoteFacade noteFacade;
    private final SourceFacade sourceFacade;

    @GetMapping("/members/{memberId}/notes/{noteId}")
    public InternalNoteResponse retrieveNoteById(@PathVariable UUID memberId, @PathVariable UUID noteId) {
        var note = noteFacade.retrieve(memberId, noteId);
        var source = sourceFacade.retrieve(memberId, note.sourceId());
        return InternalNoteResponse.from(note, source);
    }
}
