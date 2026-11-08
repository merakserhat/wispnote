package com.wispnote.backend.adapter.auth.rest.response;

public record EmailNotVerifiedResponse(String errorCode,
                                       String errorMessage,
                                       String verificationToken,
                                       Integer verificationTokenExpiresIn) {
}
