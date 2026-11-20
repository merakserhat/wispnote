package com.wispnote.backend.application.common.exception;

public abstract class ValidationException extends WispnoteException {
    private static final String ERROR_CODE = "INVALID_REQUEST";

    protected ValidationException(String message) {
        super(message);
    }

    protected ValidationException(String message, String... arguments) {
        super(message, arguments);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
