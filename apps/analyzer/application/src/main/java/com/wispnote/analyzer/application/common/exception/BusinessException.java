package com.wispnote.analyzer.application.common.exception;

public abstract class BusinessException extends WispnoteException {
    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, String... args) {
        super(message, args);
    }
}
