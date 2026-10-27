package com.wispnote.analyzer.application.automationcheckrun.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class NoteGroupSelectionFailedException extends BusinessException {
    public NoteGroupSelectionFailedException() {
        super("errors.automationCheckRun.noteGroupSelectionFailed");
    }
}
