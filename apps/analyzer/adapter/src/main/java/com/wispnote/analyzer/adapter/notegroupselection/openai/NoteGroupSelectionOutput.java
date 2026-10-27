package com.wispnote.analyzer.adapter.notegroupselection.openai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionResult;

@JsonClassDescription("Result of reading an automation rule that adds notes to a note group and extracting its condition and target group.")
public class NoteGroupSelectionOutput {

    @JsonPropertyDescription("The condition that a new note must meet for the rule to apply, as one standalone sentence in "
            + "the member's own words, without the action part. Empty string when the rule states no condition.")
    public String condition;

    @JsonPropertyDescription("The title of the note group the rule adds notes to. An existing group title copied exactly "
            + "when the rule clearly refers to it, otherwise a short new title taken from the rule. Empty string when "
            + "the rule names no group and none can be inferred.")
    public String groupTitle;

    @JsonPropertyDescription("How sure you are about the condition and the group together, from 0 to 100. Below 50 means you are guessing.")
    public int confidence;

    @JsonPropertyDescription("At most 30 words in plain English for the member who wrote the rule. When both the condition "
            + "and the group are found, restate what the automation will do. Otherwise say what is missing. No field "
            + "names or technical terms.")
    public String details;

    public NoteGroupSelectionResult toModel() {
        return new NoteGroupSelectionResult(condition, groupTitle, confidence, details);
    }
}
