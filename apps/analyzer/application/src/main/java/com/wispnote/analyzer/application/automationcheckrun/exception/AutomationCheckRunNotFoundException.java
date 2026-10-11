package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class AutomationCheckRunNotFoundException extends BusinessException {
    public AutomationCheckRunNotFoundException() {
        super("errors.automationCheckRun.notFound");
    }
}
