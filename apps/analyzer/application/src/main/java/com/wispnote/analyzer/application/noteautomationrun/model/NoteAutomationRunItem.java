package com.wispnote.analyzer.application.noteautomationrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunItemOutcome;
import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunItemStatus;

import java.util.UUID;

public record NoteAutomationRunItem(UUID id,
                                    Long version,
                                    UUID automationId,
                                    AutomationActionType actionType,
                                    NoteAutomationRunItemStatus status,
                                    NoteAutomationRunItemOutcome outcome,
                                    Integer confidence,
                                    String details,
                                    UUID noteGroupId) {
    public static final int MIN_CONFIDENCE = 50;

    public static NoteAutomationRunItem pending(RunnableAutomation automation) {
        return new NoteAutomationRunItem(
                null,
                null,
                automation.automationId(),
                automation.actionType(),
                NoteAutomationRunItemStatus.PENDING,
                null,
                null,
                null,
                null
        );
    }

    public NoteAutomationRunItem applyMatch(NoteAutomationMatch match) {
        if (!match.matched() || match.confidence() == null || match.confidence() < MIN_CONFIDENCE) {
            return new NoteAutomationRunItem(
                    id,
                    version,
                    automationId,
                    actionType,
                    NoteAutomationRunItemStatus.FINISHED,
                    NoteAutomationRunItemOutcome.NOT_MATCHED,
                    match.confidence(),
                    match.details(),
                    null
            );
        }
        return new NoteAutomationRunItem(
                id,
                version,
                automationId,
                actionType,
                NoteAutomationRunItemStatus.PENDING,
                null,
                match.confidence(),
                match.details(),
                null
        );
    }

    public NoteAutomationRunItem finish(NoteAutomationActionExecutionResult executionResult) {
        return new NoteAutomationRunItem(
                id,
                version,
                automationId,
                actionType,
                NoteAutomationRunItemStatus.FINISHED,
                executionResult.outcome(),
                confidence,
                executionResult.details() != null ? executionResult.details() : details,
                executionResult.noteGroupId()
        );
    }

    public NoteAutomationRunItem fail(String reason) {
        return new NoteAutomationRunItem(
                id,
                version,
                automationId,
                actionType,
                NoteAutomationRunItemStatus.FAILED,
                null,
                null,
                reason,
                null
        );
    }

    public boolean isPending() {
        return status == NoteAutomationRunItemStatus.PENDING;
    }

    public boolean isFinished() {
        return status == NoteAutomationRunItemStatus.FINISHED;
    }

    public boolean isFailed() {
        return status == NoteAutomationRunItemStatus.FAILED;
    }

    public boolean isWaitingForMatch() {
        return isPending() && confidence == null;
    }

    public boolean isWaitingForAction() {
        return isPending() && confidence != null;
    }
}
