package com.wispnote.backend.adapter.common.exception;

import com.wispnote.backend.application.common.exception.WispnoteException;

public abstract class NotFoundException extends WispnoteException {
    protected NotFoundException(String message) {
        super(message);
    }
}
