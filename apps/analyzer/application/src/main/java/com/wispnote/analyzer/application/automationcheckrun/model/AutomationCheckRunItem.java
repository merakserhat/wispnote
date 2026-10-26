package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;

import java.util.UUID;

public record AutomationCheckRunItem(UUID id,
                                     Long version,
                                     AutomationCheckRunStage stage,
                                     AutomationCheckRunItemStatus status,
                                     AutomationCheckRunItemResult result,
                                     AutomationActionType decidedActionType,
                                     String condition,
                                     String requiredGroupTitle) {

    public static final int MIN_CONFIDENCE = 50;

    public static AutomationCheckRunItem pending(AutomationCheckRunStage stage) {
        return new AutomationCheckRunItem(
                null,
                null,
                stage,
                AutomationCheckRunItemStatus.PENDING,
                AutomationCheckRunItemResult.empty(),
                null,
                null,
                null
        );
    }

    public AutomationCheckRunItem finish(AutomationCheckRunStageExecutionResult executionResult) {
        return switch (executionResult) {
            case AutomationActionDetectionExecutionResult r -> new AutomationCheckRunItem(
                    id,
                    version,
                    stage,
                    AutomationCheckRunItemStatus.FINISHED,
                    r.toItemResult(),
                    r.actionType(),
                    null,
                    null
            );
            case AutomationActionEnrichmentExecutionResult r -> new AutomationCheckRunItem(
                    id,
                    version,
                    stage,
                    AutomationCheckRunItemStatus.FINISHED,
                    r.toItemResult(),
                    null,
                    r.condition(),
                    r.requiredGroupTitle()
            );
        };
    }

    public AutomationCheckRunItem fail(String reason) {
        return new AutomationCheckRunItem(
                id,
                version,
                stage,
                AutomationCheckRunItemStatus.FAILED,
                new AutomationCheckRunItemResult(null, null, reason),
                null,
                null,
                null
        );
    }

    public AutomationCheckRunItem withStatus(AutomationCheckRunItemStatus status) {
        return new AutomationCheckRunItem(
                id,
                version,
                stage,
                status,
                result,
                decidedActionType,
                condition,
                requiredGroupTitle
        );
    }

    public boolean isPending() {
        return status == AutomationCheckRunItemStatus.PENDING;
    }

    public boolean isFinished() {
        return status == AutomationCheckRunItemStatus.FINISHED;
    }

    public boolean isFailed() {
        return status == AutomationCheckRunItemStatus.FAILED;
    }

    public boolean isRejected() {
        return isFinished() && result.outcome() == AutomationCheckRunItemOutcome.REJECTED;
    }

    public boolean isInvalidated() {
        return status == AutomationCheckRunItemStatus.INVALIDATED;
    }
}
