package com.wispnote.analyzer.application.noteautomationrun.model;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record NoteAutomationMatchResult(List<NoteAutomationMatch> matches) {
    public NoteAutomationMatchResult {
        matches = List.copyOf(matches);
    }

    public Optional<NoteAutomationMatch> findByAutomationId(UUID automationId) {
        return matches.stream()
                .filter(match -> match.automationId().equals(automationId))
                .findFirst();
    }
}
