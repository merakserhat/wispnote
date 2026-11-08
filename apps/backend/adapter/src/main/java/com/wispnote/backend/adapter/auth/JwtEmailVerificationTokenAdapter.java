package com.wispnote.backend.adapter.auth;

import com.wispnote.backend.application.auth.model.EmailVerificationTokenResult;
import com.wispnote.backend.application.auth.port.EmailVerificationTokenPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtEmailVerificationTokenAdapter implements EmailVerificationTokenPort {

    private static final Duration TOKEN_TTL = Duration.ofMinutes(30);
    private static final String SCOPE = "EMAIL_VERIFICATION";
    private static final String ISSUER = "wispnote";

    private final JwtEncoder accessTokenJwtEncoder;

    @Override
    public EmailVerificationTokenResult generate(UUID memberId, String email) {
        var now = Instant.now();

        var claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(email)
                .issuedAt(now)
                .expiresAt(now.plus(TOKEN_TTL))
                .claim("id", memberId.toString())
                .claim("scope", SCOPE)
                .build();

        var token = accessTokenJwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return new EmailVerificationTokenResult(token, (int) TOKEN_TTL.toSeconds());
    }
}
