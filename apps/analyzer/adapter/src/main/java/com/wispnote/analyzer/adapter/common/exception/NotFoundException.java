package com.wispnote.analyzer.adapter.common.exception;

import com.wispnote.analyzer.application.common.exception.WispnoteException;

public abstract class NotFoundException extends WispnoteException {
    protected NotFoundException(String message) {
        super(message);
    }
}
