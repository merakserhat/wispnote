package com.wispnote.backend.adapter.automation.rest.response;

import com.wispnote.backend.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.backend.application.automationcheckrun.enums.AutomationCheckRunOutcome;
import com.wispnote.backend.application.automationcheckrun.enums.AutomationCheckRunStatus;
import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;

import java.time.Instant;
import java.util.UUID;

public record AutomationCheckRunResponse(AutomationCheckRunStatus status,
                                         AutomationCheckRunOutcome outcome,
                                         AutomationActionType actionType,
                                         String condition,
                                         UUID requiredGroupId,
                                         String requiredGroupTitle,
                                         Integer confidence,
                                         String details,
                                         Instant updatedAt) {

    public static AutomationCheckRunResponse from(AutomationCheckRun checkRun) {
        return new AutomationCheckRunResponse(checkRun.status(),
                checkRun.outcome(),
                checkRun.actionType(),
                checkRun.condition(),
                checkRun.requiredGroupId(),
                checkRun.requiredGroupTitle(),
                checkRun.confidence(),
                checkRun.details(),
                checkRun.updatedAt());
    }
}
