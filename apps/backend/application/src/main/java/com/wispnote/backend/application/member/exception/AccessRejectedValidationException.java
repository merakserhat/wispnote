package com.wispnote.backend.application.member.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class AccessRejectedValidationException extends ValidationException {
    private static final String ERROR_CODE = "ACCESS_REJECTED";

    public AccessRejectedValidationException() {
        super("errors.member.accessRejected");
    }

    @Override
    public String getErrorCode() {
        return ERROR_CODE;
    }
}
