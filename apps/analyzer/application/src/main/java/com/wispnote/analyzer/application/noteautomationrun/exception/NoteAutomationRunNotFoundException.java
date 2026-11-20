package com.wispnote.analyzer.application.noteautomationrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class NoteAutomationRunNotFoundException extends BusinessException {
    public NoteAutomationRunNotFoundException() {
        super("errors.noteAutomationRun.notFound");
    }
}
