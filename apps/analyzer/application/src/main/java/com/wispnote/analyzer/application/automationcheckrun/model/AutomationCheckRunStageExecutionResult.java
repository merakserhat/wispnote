package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;

public sealed interface AutomationCheckRunStageExecutionResult
        permits AutomationActionDetectionExecutionResult, AutomationActionEnrichmentExecutionResult {

    AutomationCheckRunStage stage();

    AutomationCheckRunItemOutcome outcome();

    Integer confidence();

    String details();

    default AutomationCheckRunItemResult toItemResult() {
        return new AutomationCheckRunItemResult(outcome(), confidence(), details());
    }
}
