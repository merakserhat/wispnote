package com.wispnote.backend.application.auth.exception;

import com.wispnote.backend.application.auth.model.EmailVerificationTokenResult;
import com.wispnote.backend.application.common.exception.ValidationException;
import lombok.Getter;

@Getter
public class EmailNotVerifiedValidationException extends ValidationException {
    private final EmailVerificationTokenResult verificationToken;

    public EmailNotVerifiedValidationException(EmailVerificationTokenResult verificationToken) {
        super("errors.member.emailNotVerified");
        this.verificationToken = verificationToken;
    }
}
