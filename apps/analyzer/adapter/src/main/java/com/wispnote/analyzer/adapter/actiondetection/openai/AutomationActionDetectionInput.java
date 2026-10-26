package com.wispnote.analyzer.adapter.actiondetection.openai;

import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionRequest;

public record AutomationActionDetectionInput(String ruleText) {

    public static AutomationActionDetectionInput from(AutomationActionDetectionRequest request) {
        return new AutomationActionDetectionInput(request.ruleText());
    }
}
