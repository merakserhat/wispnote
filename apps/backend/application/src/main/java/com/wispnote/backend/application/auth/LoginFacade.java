package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.model.AccessTokenResult;
import com.wispnote.backend.application.auth.port.AccessTokenPort;
import com.wispnote.backend.application.auth.port.AuthenticationPort;
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

    public AccessTokenResult login(String email, String password) {
        log.info("Login started for {}", kv("email", email));

        var authenticatedUser = authenticationPort.authenticate(email, password);

        return accessTokenPort.generate(authenticatedUser.memberId(), email);    }
}
