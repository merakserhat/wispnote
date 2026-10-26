package com.wispnote.analyzer.application.automationcheckrun.executor;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunStageExecutionResult;

public sealed interface AutomationCheckRunStageExecutor permits AutomationActionDetectionExecutor, AutomationActionEnrichmentExecutor {
    AutomationCheckRunStageExecutionResult execute(AutomationCheckRun automationCheckRun, Automation automation);

    AutomationCheckRunStage getStage();
}
