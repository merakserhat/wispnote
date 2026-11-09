package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class GoogleLoginFailedValidationException extends ValidationException {
    public GoogleLoginFailedValidationException() {
        super("errors.googleLogin.failed");
    }
}
