package com.wispnote.backend.application.common.exception;

public abstract class BusinessException extends WispnoteException {
    protected BusinessException(String message) {
        super(message);
    }

    protected BusinessException(String message, String... arguments) {
        super(message, arguments);
    }
}
