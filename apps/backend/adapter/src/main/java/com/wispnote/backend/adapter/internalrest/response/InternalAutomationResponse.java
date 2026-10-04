package com.wispnote.backend.adapter.internalrest.response;

import com.wispnote.backend.application.automation.model.Automation;

import java.time.Instant;
import java.util.UUID;

public record InternalAutomationResponse(UUID id,
                                         UUID memberId,
                                         String ruleText,
                                         Boolean enabled,
                                         Instant createdAt,
                                         Instant updatedAt) {

    public static InternalAutomationResponse from(Automation automation) {
        return new InternalAutomationResponse(automation.id(),
                automation.memberId(),
                automation.ruleText(),
                automation.enabled(),
                automation.createdAt(),
                automation.updatedAt());
    }
}
