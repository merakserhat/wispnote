package com.wispnote.backend.application.common.exception;

public class PasswordDidntMatchWithConfirmValidationException extends ValidationException {
    public PasswordDidntMatchWithConfirmValidationException() {
        super("errors.member.passwordDidntMatchWithConfirm");
    }
}
