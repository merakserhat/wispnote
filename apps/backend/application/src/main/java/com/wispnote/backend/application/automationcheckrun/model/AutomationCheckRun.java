package com.wispnote.backend.application.automationcheckrun.model;

import com.wispnote.backend.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.backend.application.automationcheckrun.enums.AutomationCheckRunOutcome;
import com.wispnote.backend.application.automationcheckrun.enums.AutomationCheckRunStatus;

import java.util.UUID;

public record AutomationCheckRun(UUID automationId,
                                 AutomationCheckRunStatus status,
                                 AutomationCheckRunOutcome outcome,
                                 AutomationActionType actionType,
                                 String condition,
                                 UUID requiredGroupId,
                                 String requiredGroupTitle,
                                 Integer confidence,
                                 String details) {
}
