package com.wispnote.analyzer.adapter.notegroupselection.openai;

import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionRequest;
import com.wispnote.analyzer.application.notegroup.model.NoteGroup;

import java.util.List;

public record NoteGroupSelectionInput(String ruleText, List<Group> groups) {

    public record Group(String title, String description) {

        static Group from(NoteGroup noteGroup) {
            return new Group(noteGroup.title(), noteGroup.description());
        }
    }

    public static NoteGroupSelectionInput from(NoteGroupSelectionRequest request) {
        var groups = request.groups().stream()
                .map(Group::from)
                .toList();
        return new NoteGroupSelectionInput(request.ruleText(), groups);
    }
}
