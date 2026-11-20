package com.wispnote.backend.application.member.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class AccessPendingValidationException extends ValidationException {
    private static final String ERROR_CODE = "ACCESS_PENDING";

    public AccessPendingValidationException() {
        super("errors.member.accessPending");
    }

    @Override
    public String getErrorCode() {
        return ERROR_CODE;
    }
}
