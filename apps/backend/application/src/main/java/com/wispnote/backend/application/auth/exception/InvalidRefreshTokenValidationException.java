package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class InvalidRefreshTokenValidationException extends ValidationException {
    public InvalidRefreshTokenValidationException() {
        super("errors.validation.refreshToken.invalid");
    }
}
