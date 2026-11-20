package com.wispnote.analyzer.application.noteautomationrun.model;

import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunItemOutcome;

import java.util.UUID;

public record NoteAutomationActionExecutionResult(UUID automationId,
                                                  NoteAutomationRunItemOutcome outcome,
                                                  String details,
                                                  UUID noteGroupId) {

    public static NoteAutomationActionExecutionResult addedToGroup(UUID automationId, UUID noteGroupId) {
        return new NoteAutomationActionExecutionResult(automationId, NoteAutomationRunItemOutcome.APPLIED, null, noteGroupId);
    }

    public static NoteAutomationActionExecutionResult skipped(UUID automationId, String details) {
        return new NoteAutomationActionExecutionResult(automationId, NoteAutomationRunItemOutcome.SKIPPED, details, null);
    }
}
