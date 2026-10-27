package com.wispnote.analyzer.application.automation.model;

import org.apache.commons.lang3.StringUtils;

import java.time.Instant;
import java.util.UUID;

public record Automation(UUID id,
                         UUID memberId,
                         String ruleText,
                         Boolean enabled,
                         Instant createdAt,
                         Instant updatedAt) {

    public boolean hasNoRuleText() {
        return StringUtils.isBlank(ruleText);
    }
}
