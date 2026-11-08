package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.exception.PasswordDidntMatchWithConfirmValidationException;
import com.wispnote.backend.application.auth.model.RegisterResult;
import com.wispnote.backend.application.auth.port.EmailVerificationTokenPort;
import com.wispnote.backend.application.emailverification.properties.EmailVerificationProperties;
import com.wispnote.backend.application.emailverification.service.EmailVerificationService;
import com.wispnote.backend.application.member.MemberCreateService;
import com.wispnote.backend.application.member.exception.EmailAlreadyUsedValidationException;
import com.wispnote.backend.application.member.model.Member;
import com.wispnote.backend.application.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterFacade {

    private final MemberPort memberPort;
    private final MemberCreateService memberCreateService;
    private final EmailVerificationService emailVerificationService;
    private final EmailVerificationProperties emailVerificationProperties;
    private final EmailVerificationTokenPort emailVerificationTokenPort;

    @Transactional
    public RegisterResult register(String email, String password, String passwordConfirm) {
        log.info("Register started for {}", kv("email", email));

        if (!password.equals(passwordConfirm)) {
            throw new PasswordDidntMatchWithConfirmValidationException();
        }

        memberPort.findByEmail(email).ifPresent(this::replaceUnverified);

        var member = memberCreateService.create(email, password);
        emailVerificationService.issue(member);
        var verificationToken = emailVerificationTokenPort.generate(member.id(), member.email());

        return new RegisterResult(member, verificationToken, emailVerificationProperties.expiresInSeconds());
    }

    private void replaceUnverified(Member existing) {
        if (existing.isEmailVerified()) {
            throw new EmailAlreadyUsedValidationException();
        }

        log.info("Replacing unverified member {}", kv("memberId", existing.id()));
        emailVerificationService.invalidatePending(existing.id());
        memberPort.delete(existing.id());
    }
}
