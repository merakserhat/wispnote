package com.wispnote.backend.application.automation.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class AutomationEnabledLimitReachedValidationException extends ValidationException {
    public AutomationEnabledLimitReachedValidationException(int maxEnabled) {
        super("errors.automation.enabledLimitReached", String.valueOf(maxEnabled));
    }
}
