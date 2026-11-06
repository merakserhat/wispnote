package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;

import java.util.UUID;

public record AutomationActionEnrichmentExecutionResult(AutomationCheckRunItemOutcome outcome,
                                                        Integer confidence,
                                                        String details,
                                                        String condition,
                                                        UUID requiredGroupId,
                                                        String requiredGroupTitle)
        implements AutomationCheckRunStageExecutionResult {

    public static AutomationActionEnrichmentExecutionResult passed(Integer confidence, String details, String condition,
                                                                   UUID requiredGroupId, String requiredGroupTitle) {
        return new AutomationActionEnrichmentExecutionResult(
                AutomationCheckRunItemOutcome.PASSED, confidence, details, condition, requiredGroupId, requiredGroupTitle);
    }

    public static AutomationActionEnrichmentExecutionResult rejected(Integer confidence, String details) {
        return new AutomationActionEnrichmentExecutionResult(
                AutomationCheckRunItemOutcome.REJECTED, confidence, details, null, null, null);
    }

    @Override
    public AutomationCheckRunStage stage() {
        return AutomationCheckRunStage.ACTION_ENRICHMENT;
    }
}
