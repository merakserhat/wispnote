package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class PasswordDidntMatchWithConfirmValidationException extends ValidationException {
    public PasswordDidntMatchWithConfirmValidationException() {
        super("errors.member.passwordDidntMatchWithConfirm");
    }
}
