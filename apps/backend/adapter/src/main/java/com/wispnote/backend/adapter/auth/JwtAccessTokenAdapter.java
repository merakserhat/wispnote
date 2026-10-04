package com.wispnote.backend.adapter.auth;

import com.wispnote.backend.application.auth.model.AccessTokenResult;
import com.wispnote.backend.application.auth.port.AccessTokenPort;
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

    private static final Duration ACCESS_TOKEN_TTL = Duration.ofMinutes(15);
    private static final Duration REFRESH_TOKEN_TTL = Duration.ofHours(24);
    private static final String TOKEN_TYPE = "Bearer";
    private static final String SCOPE = "USER";
    private static final String ISSUER = "wispnote";

    private final JwtEncoder accessTokenJwtEncoder;
    private final JwtEncoder refreshTokenJwtEncoder;

    @Override
    public AccessTokenResult generate(UUID memberId, String email) {
        var now = Instant.now();

        var accessTokenClaims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(email)
                .issuedAt(now)
                .expiresAt(now.plus(ACCESS_TOKEN_TTL))
                .claim("id", memberId.toString())
                .claim("scope", SCOPE)
                .build();

        var refreshTokenClaims = JwtClaimsSet.builder()
                .id(UUID.randomUUID().toString())
                .issuer(ISSUER)
                .subject(email)
                .issuedAt(now)
                .expiresAt(now.plus(REFRESH_TOKEN_TTL))
                .claim("id", memberId.toString())
                .build();

        var accessToken = accessTokenJwtEncoder.encode(JwtEncoderParameters.from(accessTokenClaims)).getTokenValue();
        var refreshToken = refreshTokenJwtEncoder.encode(JwtEncoderParameters.from(refreshTokenClaims)).getTokenValue();

        return new AccessTokenResult(accessToken, refreshToken, TOKEN_TYPE, (int) ACCESS_TOKEN_TTL.toSeconds());
    }
}
