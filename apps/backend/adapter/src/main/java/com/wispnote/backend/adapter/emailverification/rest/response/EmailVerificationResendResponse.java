package com.wispnote.backend.adapter.emailverification.rest.response;

import com.wispnote.backend.application.emailverification.model.ResendResult;

public record EmailVerificationResendResponse(Integer codeExpiresIn) {

    public static EmailVerificationResendResponse from(ResendResult result) {
        return new EmailVerificationResendResponse(result.expiresInSeconds());
    }
}
