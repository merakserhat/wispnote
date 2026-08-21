package com.wispnote.analyzer.application.common.exception;

public abstract class ClientException extends WispnoteException {
    public ClientException(String message) {
        super(message);
    }
}
