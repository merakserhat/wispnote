package com.wispnote.backend.application.emailverification.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class EmailVerificationInvalidCodeValidationException extends ValidationException {
    public EmailVerificationInvalidCodeValidationException() {
        super("errors.emailVerification.invalidCode");
    }
}
