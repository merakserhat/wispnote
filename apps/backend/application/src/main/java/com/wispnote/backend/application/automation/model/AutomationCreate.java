package com.wispnote.backend.application.automation.model;

import java.util.UUID;

public record AutomationCreate(String ruleText) {

    public Automation toAutomation(UUID memberId) {
        return new Automation(null, memberId, ruleText, true, null, null);
    }
}
