package com.wispnote.backend.adapter.common.auth;

import com.wispnote.backend.application.common.auth.model.AccessTokenResult;
import com.wispnote.backend.application.common.auth.port.AccessTokenPort;
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
public class JwtAccessTokenAdapter implements AccessTokenPort {

    private static final Duration ACCESS_TOKEN_TTL = Duration.ofHours(3);
    private static final String TOKEN_TYPE = "Bearer";
    private static final String SCOPE = "USER";

    private final JwtEncoder accessTokenJwtEncoder;

    @Override
    public AccessTokenResult generate(UUID memberId, String email) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer("wispnote")
                .subject(email)
                .issuedAt(now)
                .expiresAt(now.plus(ACCESS_TOKEN_TTL))
                .claim("id", memberId.toString())
                .claim("scope", SCOPE)
                .build();

        var accessToken = accessTokenJwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return new AccessTokenResult(accessToken, TOKEN_TYPE, (int) ACCESS_TOKEN_TTL.toSeconds());
    }
}