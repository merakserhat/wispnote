package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class GoogleEmailNotVerifiedValidationException extends ValidationException {
    public GoogleEmailNotVerifiedValidationException() {
        super("errors.googleLogin.emailNotVerified");
    }
}
