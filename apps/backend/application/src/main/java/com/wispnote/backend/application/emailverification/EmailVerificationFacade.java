package com.wispnote.backend.application.emailverification;

import com.wispnote.backend.application.auth.model.AccessTokenResult;
import com.wispnote.backend.application.auth.port.AccessTokenPort;
import com.wispnote.backend.application.auth.port.PasswordHasherPort;
import com.wispnote.backend.application.emailverification.enums.EmailVerificationStatus;
import com.wispnote.backend.application.emailverification.exception.EmailVerificationInvalidCodeValidationException;
import com.wispnote.backend.application.emailverification.model.ResendResult;
import com.wispnote.backend.application.emailverification.port.EmailVerificationPort;
import com.wispnote.backend.application.emailverification.properties.EmailVerificationProperties;
import com.wispnote.backend.application.emailverification.service.EmailVerificationService;
import com.wispnote.backend.application.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationFacade {

    private final MemberPort memberPort;
    private final EmailVerificationPort emailVerificationPort;
    private final EmailVerificationService emailVerificationService;
    private final EmailVerificationProperties properties;
    private final PasswordHasherPort passwordHasherPort;
    private final AccessTokenPort accessTokenPort;

    @Transactional(noRollbackFor = EmailVerificationInvalidCodeValidationException.class)
    public AccessTokenResult confirm(UUID memberId, String code) {
        log.info("Email verification confirm started for {}", kv("memberId", memberId));

        var member = memberPort.findById(memberId)
                .filter(found -> !found.isEmailVerified())
                .orElseThrow(EmailVerificationInvalidCodeValidationException::new);

        var verification = emailVerificationPort.findAllPendingByMemberIdForUpdate(member.id()).stream()
                .findFirst()
                .orElseThrow(EmailVerificationInvalidCodeValidationException::new);

        var now = Instant.now();
        if (verification.isExpired(now)) {
            emailVerificationPort.update(verification.withStatus(EmailVerificationStatus.EXPIRED));
            throw new EmailVerificationInvalidCodeValidationException();
        }

        if (!passwordHasherPort.matches(code, verification.codeHash())) {
            var failed = emailVerificationPort.update(verification.registerWrongAttempt(properties.getMaxWrongAttempts()));
            log.info("Wrong email verification code for {} {} {}",
                    kv("memberId", member.id()),
                    kv("wrongAttempts", failed.wrongAttempts()),
                    kv("status", failed.status()));
            throw new EmailVerificationInvalidCodeValidationException();
        }

        memberPort.markEmailVerified(member.id(), now);
        emailVerificationPort.update(verification.withStatus(EmailVerificationStatus.CONFIRMED));

        log.info("Email verified for {}", kv("memberId", member.id()));

        return accessTokenPort.generate(member.id(), member.email());
    }

    @Transactional
    public ResendResult resend(UUID memberId) {
        log.info("Email verification resend started for {}", kv("memberId", memberId));

        memberPort.findById(memberId)
                .filter(member -> !member.isEmailVerified())
                .ifPresent(emailVerificationService::issue);

        return new ResendResult(properties.expiresInSeconds());
    }
}
