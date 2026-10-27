package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.notegroup.model.NoteGroup;

import java.util.List;

public record NoteGroupSelectionRequest(String ruleText, List<NoteGroup> groups) {

    public NoteGroupSelectionRequest {
        groups = List.copyOf(groups);
    }
}
