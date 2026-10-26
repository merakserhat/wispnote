package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;

public record AutomationActionEnrichmentExecutionResult(AutomationCheckRunItemOutcome outcome,
                                                        Integer confidence,
                                                        String details,
                                                        String condition,
                                                        String requiredGroupTitle)
        implements AutomationCheckRunStageExecutionResult {

    @Override
    public AutomationCheckRunStage stage() {
        return AutomationCheckRunStage.ACTION_ENRICHMENT;
    }
}
