package com.wispnote.backend.adapter.notegroup.rest;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.notegroup.rest.request.NoteGroupAddNoteRequest;
import com.wispnote.backend.adapter.notegroup.rest.request.NoteGroupCreateRequest;
import com.wispnote.backend.adapter.notegroup.rest.request.NoteGroupListRequest;
import com.wispnote.backend.adapter.notegroup.rest.response.NoteGroupResponse;
import com.wispnote.backend.application.notegroup.NoteGroupFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/note-groups")
public class NoteGroupController {

    private final NoteGroupFacade noteGroupFacade;

    @PostMapping
    public NoteGroupResponse create(@RequestBody @Valid NoteGroupCreateRequest request,
                                    @AuthenticationPrincipal CustomUserDetails userDetail) {
        var noteGroup = noteGroupFacade.create(userDetail.getId(), request.toModel());
        return NoteGroupResponse.from(noteGroup);
    }

    @GetMapping
    public List<NoteGroupResponse> list(@ModelAttribute NoteGroupListRequest request,
                                       @AuthenticationPrincipal CustomUserDetails userDetail) {
        return noteGroupFacade.list(userDetail.getId(), request.toFilter()).stream()
                .map(NoteGroupResponse::from)
                .toList();
    }

    @GetMapping("/{noteGroupId}")
    public NoteGroupResponse retrieve(@PathVariable UUID noteGroupId,
                                      @AuthenticationPrincipal CustomUserDetails userDetail) {
        var noteGroup = noteGroupFacade.retrieve(userDetail.getId(), noteGroupId);
        return NoteGroupResponse.from(noteGroup);
    }

    @DeleteMapping("/{noteGroupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID noteGroupId,
                       @AuthenticationPrincipal CustomUserDetails userDetail) {
        noteGroupFacade.delete(userDetail.getId(), noteGroupId);
    }

    @PostMapping("/{noteGroupId}/notes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addNote(@PathVariable UUID noteGroupId,
                        @RequestBody @Valid NoteGroupAddNoteRequest request,
                        @AuthenticationPrincipal CustomUserDetails userDetail) {
        noteGroupFacade.addNote(userDetail.getId(), noteGroupId, request.getNoteId());
    }

    @DeleteMapping("/{noteGroupId}/notes/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeNote(@PathVariable UUID noteGroupId,
                           @PathVariable UUID noteId,
                           @AuthenticationPrincipal CustomUserDetails userDetail) {
        noteGroupFacade.removeNote(userDetail.getId(), noteGroupId, noteId);
    }
}
