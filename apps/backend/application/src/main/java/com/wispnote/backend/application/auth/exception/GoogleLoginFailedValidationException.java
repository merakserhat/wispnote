package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class GoogleLoginFailedValidationException extends ValidationException {
    private static final String ERROR_CODE = "GOOGLE_LOGIN_FAILED";

    public GoogleLoginFailedValidationException() {
        super("errors.googleLogin.failed");
    }

    @Override
    public String getErrorCode() {
        return ERROR_CODE;
    }
}
