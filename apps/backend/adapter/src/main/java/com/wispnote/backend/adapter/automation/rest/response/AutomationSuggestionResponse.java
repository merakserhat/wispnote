package com.wispnote.backend.adapter.automation.rest.response;

import com.wispnote.backend.application.automation.model.AutomationSuggestion;

import java.util.UUID;

public record AutomationSuggestionResponse(UUID id, String ruleText) {

    public static AutomationSuggestionResponse from(AutomationSuggestion suggestion) {
        return new AutomationSuggestionResponse(suggestion.id(), suggestion.ruleText());
    }
}
