package com.wispnote.analyzer.application.common.exception;

public abstract class ValidationException extends WispnoteException {
    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, String... args) {
        super(message, args);
    }
}
