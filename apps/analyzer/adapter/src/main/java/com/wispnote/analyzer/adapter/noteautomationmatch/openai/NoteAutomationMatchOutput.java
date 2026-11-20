package com.wispnote.analyzer.adapter.noteautomationmatch.openai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatch;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchResult;

import java.util.List;
import java.util.UUID;

@JsonClassDescription("Result of checking one note against the conditions of a member's automation rules.")
public class NoteAutomationMatchOutput {

    @JsonPropertyDescription("One entry per rule in the input, in the same order.")
    public List<Match> matches;

    @JsonClassDescription("The verdict for one rule.")
    public static class Match {

        @JsonPropertyDescription("The id of the rule, copied exactly from the input.")
        public String ruleId;

        @JsonPropertyDescription("True when the note meets the rule's condition, false otherwise.")
        public boolean matched;

        @JsonPropertyDescription("How sure you are about the verdict, from 0 to 100. Below 50 means you are guessing.")
        public int confidence;

        @JsonPropertyDescription("At most 25 words in plain English for the member who wrote the rule, saying why the note "
                + "does or does not meet the condition. No field names or technical terms.")
        public String details;

        NoteAutomationMatch toModel() {
            return new NoteAutomationMatch(UUID.fromString(ruleId.strip()), matched, confidence, details);
        }
    }

    public NoteAutomationMatchResult toModel() {
        if (matches == null) {
            return new NoteAutomationMatchResult(List.of());
        }
        return new NoteAutomationMatchResult(matches.stream()
                .map(Match::toModel)
                .toList());
    }
}
