package com.wispnote.backend.application.common.exception;

public class EmailAlreadyUsedValidationException extends ValidationException {
    public EmailAlreadyUsedValidationException() {
        super("errors.member.emailAlreadyUsed");
    }
}
