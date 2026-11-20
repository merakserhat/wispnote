package com.wispnote.analyzer.application.noteautomationrun.exception;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.common.exception.BusinessException;

public class NoteAutomationActionExecutorNotFoundException extends BusinessException {
    public NoteAutomationActionExecutorNotFoundException(AutomationActionType actionType) {
        super("errors.noteAutomationRun.actionExecutorNotFound", actionType.name());
    }
}
