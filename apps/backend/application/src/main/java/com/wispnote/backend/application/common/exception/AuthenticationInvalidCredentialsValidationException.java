package com.wispnote.backend.application.common.exception;

public class AuthenticationInvalidCredentialsValidationException extends ValidationException {
    public AuthenticationInvalidCredentialsValidationException() {
        super("errors.validation.login.invalidCredentials");
    }
}

