package com.wispnote.backend.adapter.notegroup.rest.request;

import com.wispnote.backend.application.notegroup.model.NoteGroupFilter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteGroupListRequest {

    private String search;

    public NoteGroupFilter toFilter() {
        return new NoteGroupFilter(search);
    }
}
