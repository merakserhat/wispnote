package com.wispnote.backend.application.emailverification.model;

import com.wispnote.backend.application.emailverification.enums.EmailVerificationStatus;

import java.time.Instant;
import java.util.UUID;

public record EmailVerification(UUID id,
                                UUID memberId,
                                String email,
                                String codeHash,
                                EmailVerificationStatus status,
                                Instant expiresAt,
                                Integer wrongAttempts,
                                Instant createdAt) {

    public static EmailVerification pending(UUID memberId, String email, String codeHash, Instant expiresAt) {
        return new EmailVerification(null, memberId, email, codeHash, EmailVerificationStatus.PENDING, expiresAt, 0, null);
    }

    public boolean isExpired(Instant now) {
        return expiresAt.isBefore(now);
    }

    public EmailVerification withStatus(EmailVerificationStatus newStatus) {
        return new EmailVerification(id, memberId, email, codeHash, newStatus, expiresAt, wrongAttempts, createdAt);
    }

    public EmailVerification registerWrongAttempt(int maxWrongAttempts) {
        var attempts = wrongAttempts + 1;
        var newStatus = attempts >= maxWrongAttempts ? EmailVerificationStatus.INVALIDATED : status;

        return new EmailVerification(id, memberId, email, codeHash, newStatus, expiresAt, attempts, createdAt);
    }
}
