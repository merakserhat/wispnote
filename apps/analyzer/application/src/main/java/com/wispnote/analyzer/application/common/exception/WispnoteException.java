package com.wispnote.analyzer.application.common.exception;

import lombok.Getter;

@Getter
public abstract class WispnoteException extends RuntimeException {
    private final String[] arguments;

    protected WispnoteException(String message) {
        super(message);
        arguments = new String[0];
    }

    protected WispnoteException(String message, String... arguments) {
        super(message);
        this.arguments = arguments;
    }
}
