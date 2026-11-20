package com.wispnote.analyzer.application.noteautomationrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class NoteAutomationRunConflictException extends BusinessException {
    public NoteAutomationRunConflictException() {
        super("errors.noteAutomationRun.conflict");
    }
}
