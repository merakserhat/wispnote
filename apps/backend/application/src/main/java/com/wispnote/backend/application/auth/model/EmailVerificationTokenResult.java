package com.wispnote.backend.application.auth.model;

public record EmailVerificationTokenResult(String token, Integer expiresIn) {
}
