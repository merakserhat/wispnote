package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.common.exception.BusinessException;

public class AutomationActionEnrichmentStrategyNotFoundException extends BusinessException {
    public AutomationActionEnrichmentStrategyNotFoundException(AutomationActionType actionType) {
        super("errors.automationCheckRun.enrichmentStrategyNotFound", actionType.name());
    }
}
