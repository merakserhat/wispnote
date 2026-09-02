package com.wispnote.backend.adapter.note.rest.request;

import com.wispnote.backend.application.note.enums.NoteKind;
import com.wispnote.backend.application.note.model.NoteCapture;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.Set;

@Getter
@Setter
public class NoteCreateRequest {

    @Valid
    @NotNull(message = "{validations.note.source.empty}")
    private SourceCaptureRequest source;

    private NoteKind kind;
    private String selectedText;
    private String userNote;
    private String contextBefore;
    private String contextAfter;
    private String section;
    private Integer pageNumber;
    private Map<String, Object> location;
    private String windowTitle;
    private Map<String, Object> rawCapture;
    private Set<String> tags;

    public NoteCapture toModel() {
        return new NoteCapture(source.toModel(),
                kind,
                selectedText,
                userNote,
                contextBefore,
                contextAfter,
                section,
                pageNumber,
                location,
                windowTitle,
                rawCapture,
                tags);
    }
}
