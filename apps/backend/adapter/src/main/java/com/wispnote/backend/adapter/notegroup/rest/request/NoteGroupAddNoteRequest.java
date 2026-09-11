package com.wispnote.backend.adapter.notegroup.rest.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class NoteGroupAddNoteRequest {

    @NotNull(message = "{validations.noteGroup.noteId.empty}")
    private UUID noteId;
}
