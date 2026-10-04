package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class AuthenticationInvalidCredentialsValidationException extends ValidationException {
    public AuthenticationInvalidCredentialsValidationException() {
        super("errors.validation.login.invalidCredentials");
    }
}

