package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.exception.GoogleEmailNotVerifiedValidationException;
import com.wispnote.backend.application.auth.exception.GoogleLoginFailedValidationException;
import com.wispnote.backend.application.auth.model.AccessTokenResult;
import com.wispnote.backend.application.auth.model.GoogleIdentity;
import com.wispnote.backend.application.auth.port.AccessTokenPort;
import com.wispnote.backend.application.auth.port.GoogleIdentityPort;
import com.wispnote.backend.application.common.exception.ClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleLoginFacade {

    private static final Pattern LOOPBACK_REDIRECT_URI = Pattern.compile("^http://127\\.0\\.0\\.1:\\d+/callback$");

    private final GoogleIdentityPort googleIdentityPort;
    private final GoogleMemberService googleMemberService;
    private final AccessTokenPort accessTokenPort;

    public AccessTokenResult login(String code, String codeVerifier, String redirectUri) {
        log.info("Google login started");

        if (!LOOPBACK_REDIRECT_URI.matcher(redirectUri).matches()) {
            log.warn("Google login rejected, redirect uri is not loopback {}", kv("redirectUri", redirectUri));
            throw new GoogleLoginFailedValidationException();
        }

        var identity = exchange(code, codeVerifier, redirectUri);

        if (!identity.emailVerified()) {
            log.info("Google login rejected, email not verified at Google {}", kv("email", identity.email()));
            throw new GoogleEmailNotVerifiedValidationException();
        }

        var member = googleMemberService.resolve(identity);

        log.info("Google login completed for {}", kv("memberId", member.id()));
        return accessTokenPort.generate(member.id(), member.email());
    }

    private GoogleIdentity exchange(String code, String codeVerifier, String redirectUri) {
        try {
            return googleIdentityPort.exchange(code, codeVerifier, redirectUri);
        } catch (ClientException e) {
            log.warn("Google login rejected, code exchange failed", e);
            throw new GoogleLoginFailedValidationException();
        }
    }
}
