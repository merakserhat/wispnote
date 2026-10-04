package com.wispnote.backend.adapter.note.rest;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.common.rest.response.PageResponse;
import com.wispnote.backend.adapter.note.rest.request.NoteCreateRequest;
import com.wispnote.backend.adapter.note.rest.request.NoteListRequest;
import com.wispnote.backend.adapter.note.rest.response.NoteResponse;
import com.wispnote.backend.application.note.NoteFacade;
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

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/notes")
public class NoteController {

    private final NoteFacade noteFacade;

    @PostMapping
    public NoteResponse create(@RequestBody @Valid NoteCreateRequest request,
                               @AuthenticationPrincipal CustomUserDetails userDetail) {
        var note = noteFacade.create(userDetail.getId(), request.toModel());
        return NoteResponse.from(note);
    }

    @GetMapping
    public PageResponse<NoteResponse> list(@ModelAttribute @Valid NoteListRequest request,
                                           @AuthenticationPrincipal CustomUserDetails userDetail) {
        var paginated = noteFacade.list(userDetail.getId(), request.toFilter(), request.toPaginationInfo());

        return PageResponse.from(paginated, NoteResponse::from);
    }

    @GetMapping("/{noteId}")
    public NoteResponse retrieve(@PathVariable UUID noteId,
                                 @AuthenticationPrincipal CustomUserDetails userDetail) {
        var note = noteFacade.retrieve(userDetail.getId(), noteId);
        return NoteResponse.from(note);
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID noteId,
                       @AuthenticationPrincipal CustomUserDetails userDetail) {
        noteFacade.delete(userDetail.getId(), noteId);
    }
}
