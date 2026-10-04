package com.wispnote.backend.adapter.notegroup.rest.request;

import com.wispnote.backend.application.notegroup.model.CreateNoteGroupCommand;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteGroupCreateRequest {

    @NotBlank(message = "{validations.noteGroup.title.blank}")
    private String title;

    private String description;

    public CreateNoteGroupCommand toModel() {
        return new CreateNoteGroupCommand(title, description);
    }
}
