package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;

public record AutomationCheckRunItemResult(AutomationCheckRunItemOutcome outcome,
                                           Integer confidence,
                                           String details) {

    public static AutomationCheckRunItemResult empty() {
        return new AutomationCheckRunItemResult(null, null, null);
    }
}
