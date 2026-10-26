package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class AutomationActionDetectionFailedException extends BusinessException {
    public AutomationActionDetectionFailedException() {
        super("errors.automationCheckRun.actionDetectionFailed");
    }
}
