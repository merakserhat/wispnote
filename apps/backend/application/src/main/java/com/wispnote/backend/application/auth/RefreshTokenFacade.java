package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.model.AccessTokenResult;
import com.wispnote.backend.application.auth.port.AccessTokenPort;
import com.wispnote.backend.application.auth.port.RefreshTokenPort;
import com.wispnote.backend.application.auth.exception.InvalidRefreshTokenValidationException;
import com.wispnote.backend.application.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenFacade {

    private final RefreshTokenPort refreshTokenPort;
    private final MemberPort memberPort;
    private final AccessTokenPort accessTokenPort;

    public AccessTokenResult refresh(String refreshToken) {
        var memberId = refreshTokenPort.readMemberId(refreshToken);
        log.info("Refresh started for {}", kv("memberId", memberId));

        var member = memberPort.findById(memberId)
                .orElseThrow(InvalidRefreshTokenValidationException::new);

        return accessTokenPort.generate(member.id(), member.email());
    }
}
