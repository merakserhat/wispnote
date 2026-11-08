package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.exception.EmailNotVerifiedValidationException;
import com.wispnote.backend.application.auth.model.AccessTokenResult;
import com.wispnote.backend.application.auth.port.AccessTokenPort;
import com.wispnote.backend.application.auth.port.AuthenticationPort;
import com.wispnote.backend.application.auth.port.EmailVerificationTokenPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginFacade {

    private final AuthenticationPort authenticationPort;
    private final AccessTokenPort accessTokenPort;
    private final EmailVerificationTokenPort emailVerificationTokenPort;

    public AccessTokenResult login(String email, String password) {
        log.info("Login started for {}", kv("email", email));

        var authenticatedUser = authenticationPort.authenticate(email, password);

        if (!authenticatedUser.emailVerified()) {
            log.info("Login rejected, email not verified for {}", kv("memberId", authenticatedUser.memberId()));
            var verificationToken = emailVerificationTokenPort.generate(authenticatedUser.memberId(), email);
            throw new EmailNotVerifiedValidationException(verificationToken);
        }

        return accessTokenPort.generate(authenticatedUser.memberId(), email);
    }
}
