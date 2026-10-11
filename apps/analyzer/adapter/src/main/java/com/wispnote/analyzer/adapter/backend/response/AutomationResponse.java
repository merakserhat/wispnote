package com.wispnote.analyzer.adapter.backend.response;

import com.wispnote.analyzer.application.automation.model.Automation;

import java.time.Instant;
import java.util.UUID;

public record AutomationResponse(UUID id,
                                 UUID memberId,
                                 String ruleText,
                                 Boolean enabled,
                                 Instant createdAt,
                                 Instant updatedAt) {

    public Automation toModel() {
        return new Automation(id, memberId, ruleText, enabled, createdAt, updatedAt);
    }
}
