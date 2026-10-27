package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class AutomationActionNotDecidedException extends BusinessException {
    public AutomationActionNotDecidedException() {
        super("errors.automationCheckRun.actionNotDecided");
    }
}
