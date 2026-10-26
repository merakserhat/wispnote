package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import org.apache.commons.lang3.StringUtils;

import java.util.EnumSet;
import java.util.List;

public record AutomationActionDetectionRequest(String ruleText, List<AutomationActionType> supportedActionTypes) {

    public AutomationActionDetectionRequest {
        if (StringUtils.isBlank(ruleText)) {
            throw new IllegalArgumentException("Rule text must not be blank");
        }
        if (supportedActionTypes == null || supportedActionTypes.isEmpty()) {
            throw new IllegalArgumentException("At least one supported action type is required");
        }
        supportedActionTypes = List.copyOf(supportedActionTypes);
    }

    public static AutomationActionDetectionRequest of(String ruleText) {
        return new AutomationActionDetectionRequest(ruleText, List.copyOf(EnumSet.allOf(AutomationActionType.class)));
    }
}
