package com.wispnote.backend.adapter.auth;

import com.wispnote.backend.application.auth.port.RefreshTokenPort;
import com.wispnote.backend.application.auth.exception.InvalidRefreshTokenValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtRefreshTokenAdapter implements RefreshTokenPort {

    private final JwtDecoder refreshTokenJwtDecoder;

    @Override
    public UUID readMemberId(String refreshToken) {
        try {
            var jwt = refreshTokenJwtDecoder.decode(refreshToken);

            return UUID.fromString(jwt.getClaimAsString("id"));
        } catch (JwtException | IllegalArgumentException e) {
            log.info("An invalid refresh token was presented");

            throw new InvalidRefreshTokenValidationException();
        }
    }
}
