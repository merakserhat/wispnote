package com.wispnote.backend.application.member.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class EmailAlreadyUsedValidationException extends ValidationException {
    public EmailAlreadyUsedValidationException() {
        super("errors.member.emailAlreadyUsed");
    }
}
