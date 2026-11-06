package com.wispnote.backend.adapter.automation.rest.response;

import com.wispnote.backend.application.automation.model.Automation;
import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;

import java.time.Instant;
import java.util.UUID;

public record AutomationResponse(UUID id,
                                 String ruleText,
                                 Boolean enabled,
                                 Instant createdAt,
                                 Instant updatedAt,
                                 AutomationCheckRunResponse checkRun) {

    public static AutomationResponse from(Automation automation) {
        return from(automation, null);
    }

    public static AutomationResponse from(Automation automation, AutomationCheckRun checkRun) {
        return new AutomationResponse(automation.id(),
                automation.ruleText(),
                automation.enabled(),
                automation.createdAt(),
                automation.updatedAt(),
                checkRun != null ? AutomationCheckRunResponse.from(checkRun) : null);
    }
}
