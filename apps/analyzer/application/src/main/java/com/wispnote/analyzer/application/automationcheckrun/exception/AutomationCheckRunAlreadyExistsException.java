package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class AutomationCheckRunAlreadyExistsException extends BusinessException {
    public AutomationCheckRunAlreadyExistsException() {
        super("errors.automationCheckRun.alreadyExists");
    }
}
