package com.wispnote.backend.adapter.automation.rest.response;

import com.wispnote.backend.application.automation.model.Automation;

import java.time.Instant;
import java.util.UUID;

public record AutomationResponse(UUID id,
                                 String ruleText,
                                 Boolean enabled,
                                 Instant createdAt,
                                 Instant updatedAt) {

    public static AutomationResponse from(Automation automation) {
        return new AutomationResponse(automation.id(),
                automation.ruleText(),
                automation.enabled(),
                automation.createdAt(),
                automation.updatedAt());
    }
}
