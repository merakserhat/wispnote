package com.wispnote.backend.application.emailverification.exception;

import com.wispnote.backend.application.common.exception.ValidationException;

public class EmailVerificationSendLimitReachedValidationException extends ValidationException {
    public EmailVerificationSendLimitReachedValidationException(long hoursUntilNextSend) {
        super("errors.emailVerification.sendLimitReached", String.valueOf(hoursUntilNextSend));
    }
}
