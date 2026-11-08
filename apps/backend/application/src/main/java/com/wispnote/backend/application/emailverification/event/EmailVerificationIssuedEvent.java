package com.wispnote.backend.application.emailverification.event;

import java.time.Instant;

public record EmailVerificationIssuedEvent(String email, String code, Instant expiresAt) {
}
