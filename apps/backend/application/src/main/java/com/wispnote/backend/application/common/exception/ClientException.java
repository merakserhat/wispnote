package com.wispnote.backend.application.common.exception;

public abstract class ClientException extends WispnoteException {
    protected ClientException(String message) {
        super(message);
    }

    protected ClientException(String message, Throwable cause) {
        super(message, cause);
    }
}
