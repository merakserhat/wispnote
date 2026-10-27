package com.wispnote.analyzer.application.automationcheckrun.executor.strategy;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionEnrichmentExecutionResult;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;

public interface AutomationActionEnrichmentStrategy {

    AutomationActionEnrichmentExecutionResult enrich(AutomationCheckRun automationCheckRun, Automation automation);

    AutomationActionType getActionType();
}
