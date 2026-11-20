package com.wispnote.analyzer.application.noteautomationrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class NoteAutomationMatchFailedException extends BusinessException {
    public NoteAutomationMatchFailedException() {
        super("errors.noteAutomationRun.matchFailed");
    }
}
