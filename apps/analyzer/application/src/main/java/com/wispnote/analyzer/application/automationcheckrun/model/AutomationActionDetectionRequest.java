package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;

import java.util.EnumSet;
import java.util.List;

public record AutomationActionDetectionRequest(String ruleText, List<AutomationActionType> supportedActionTypes) {

    public AutomationActionDetectionRequest {
        supportedActionTypes = List.copyOf(supportedActionTypes);
    }

    public static AutomationActionDetectionRequest of(String ruleText) {
        return new AutomationActionDetectionRequest(ruleText, List.copyOf(EnumSet.allOf(AutomationActionType.class)));
    }
}
