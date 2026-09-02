package com.wispnote.backend.application.note.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class SourceKeyNotResolvableValidationException extends ValidationException {
    public SourceKeyNotResolvableValidationException() {
        super("errors.note.source.keyNotResolvable");
    }
}
