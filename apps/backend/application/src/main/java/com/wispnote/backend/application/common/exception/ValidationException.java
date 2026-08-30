package com.wispnote.backend.application.common.exception;

public abstract class ValidationException extends WispnoteException {
    protected ValidationException(String message) {
        super(message);
    }

    protected ValidationException(String message, String... arguments) {
        super(message, arguments);
    }
}
