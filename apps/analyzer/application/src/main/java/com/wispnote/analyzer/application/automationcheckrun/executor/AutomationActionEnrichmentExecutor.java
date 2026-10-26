package com.wispnote.analyzer.application.automationcheckrun.executor;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunStageExecutionResult;
import org.springframework.stereotype.Service;

@Service
public final class AutomationActionEnrichmentExecutor implements AutomationCheckRunStageExecutor {
    @Override
    public AutomationCheckRunStageExecutionResult execute(AutomationCheckRun automationCheckRun) {
        return null;
    }

    @Override
    public AutomationCheckRunStage getStage() {
        return AutomationCheckRunStage.ACTION_ENRICHMENT;
    }
}
