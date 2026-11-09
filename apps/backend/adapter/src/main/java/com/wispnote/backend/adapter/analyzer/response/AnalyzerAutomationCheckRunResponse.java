package com.wispnote.backend.adapter.analyzer.response;

import com.wispnote.backend.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.backend.application.automationcheckrun.enums.AutomationCheckRunOutcome;
import com.wispnote.backend.application.automationcheckrun.enums.AutomationCheckRunStatus;
import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;

import java.time.Instant;
import java.util.UUID;

public record AnalyzerAutomationCheckRunResponse(UUID automationId,
                                                 AutomationCheckRunStatus status,
                                                 AutomationCheckRunOutcome outcome,
                                                 AutomationActionType actionType,
                                                 String condition,
                                                 UUID requiredGroupId,
                                                 String requiredGroupTitle,
                                                 Integer confidence,
                                                 String details,
                                                 Instant updatedAt) {

    public AutomationCheckRun toModel() {
        return new AutomationCheckRun(automationId,
                status,
                outcome,
                actionType,
                condition,
                requiredGroupId,
                requiredGroupTitle,
                confidence,
                details,
                updatedAt);
    }
}
