package com.wispnote.backend.application.emailverification.port;

import com.wispnote.backend.application.emailverification.model.EmailVerification;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface EmailVerificationPort {
    EmailVerification create(EmailVerification emailVerification);
    EmailVerification update(EmailVerification emailVerification);
    List<EmailVerification> findAllPendingByMemberIdForUpdate(UUID memberId);
    List<EmailVerification> findAllByEmailCreatedAfter(String email, Instant from);
}
