package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class AutomationCheckRunConflictException extends BusinessException {
    public AutomationCheckRunConflictException() {
        super("errors.automationCheckRun.conflict");
    }
}
