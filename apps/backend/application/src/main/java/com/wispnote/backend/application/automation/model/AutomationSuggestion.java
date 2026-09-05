package com.wispnote.backend.application.automation.model;

import java.util.UUID;

public record AutomationSuggestion(UUID id, String ruleText) {
}
