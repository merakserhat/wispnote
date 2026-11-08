package com.wispnote.backend.application.emailverification.service;

import com.wispnote.backend.application.auth.port.PasswordHasherPort;
import com.wispnote.backend.application.emailverification.enums.EmailVerificationStatus;
import com.wispnote.backend.application.emailverification.event.EmailVerificationIssuedEvent;
import com.wispnote.backend.application.emailverification.exception.EmailVerificationSendLimitReachedValidationException;
import com.wispnote.backend.application.emailverification.model.EmailVerification;
import com.wispnote.backend.application.emailverification.port.EmailVerificationPort;
import com.wispnote.backend.application.emailverification.properties.EmailVerificationProperties;
import com.wispnote.backend.application.member.model.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final int CODE_BOUND = 1_000_000;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final EmailVerificationPort emailVerificationPort;
    private final EmailVerificationProperties properties;
    private final PasswordHasherPort passwordHasherPort;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public EmailVerification issue(Member member) {
        log.info("Issuing email verification for {}", kv("memberId", member.id()));

        var now = Instant.now();
        checkSendLimit(member.email(), now);
        invalidatePending(member.id());

        var code = generateCode();
        var expiresAt = now.plus(properties.getExpiresIn());
        var created = emailVerificationPort.create(
                EmailVerification.pending(member.id(), member.email(), passwordHasherPort.hash(code), expiresAt));

        applicationEventPublisher.publishEvent(new EmailVerificationIssuedEvent(member.email(), code, expiresAt));

        return created;
    }

    public void invalidatePending(UUID memberId) {
        emailVerificationPort.findAllPendingByMemberIdForUpdate(memberId)
                .forEach(pending -> emailVerificationPort.update(pending.withStatus(EmailVerificationStatus.INVALIDATED)));
    }

    private void checkSendLimit(String email, Instant now) {
        var windowStart = now.minus(properties.getSendWindow());
        var sent = emailVerificationPort.findAllByEmailCreatedAfter(email, windowStart);

        if (sent.size() < properties.getMaxSendsPerWindow()) {
            return;
        }

        var nextAllowedAt = sent.getFirst().createdAt().plus(properties.getSendWindow());
        var hoursUntilNextSend = Math.max(1, Duration.between(now, nextAllowedAt).plusHours(1).minusSeconds(1).toHours());

        log.warn("Email verification send limit reached for {} {}", kv("email", email), kv("hoursUntilNextSend", hoursUntilNextSend));
        throw new EmailVerificationSendLimitReachedValidationException(hoursUntilNextSend);
    }

    private String generateCode() {
        return String.format("%06d", RANDOM.nextInt(CODE_BOUND));
    }
}
