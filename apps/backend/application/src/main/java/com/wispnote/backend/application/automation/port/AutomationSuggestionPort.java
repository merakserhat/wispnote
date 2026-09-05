package com.wispnote.backend.application.automation.port;

import com.wispnote.backend.application.automation.model.AutomationSuggestion;

import java.util.List;

public interface AutomationSuggestionPort {
    List<AutomationSuggestion> findAll(int size);
}
