package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;

public record AutomationActionDetectionExecutionResult(AutomationCheckRunItemOutcome outcome,
                                                       Integer confidence,
                                                       String details,
                                                       AutomationActionType actionType)
        implements AutomationCheckRunStageExecutionResult {

    @Override
    public AutomationCheckRunStage stage() {
        return AutomationCheckRunStage.ACTION_DETECTION;
    }
}
