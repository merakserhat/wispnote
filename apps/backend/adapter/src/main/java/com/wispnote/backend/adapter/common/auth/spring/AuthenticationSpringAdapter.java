package com.wispnote.backend.adapter.common.auth.spring;

import com.wispnote.backend.adapter.common.auth.model.CustomUserDetails;
import com.wispnote.backend.application.common.auth.model.AuthenticatedUser;
import com.wispnote.backend.application.common.auth.port.AuthenticationPort;
import com.wispnote.backend.application.common.exception.AuthenticationInvalidCredentialsValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationSpringAdapter implements AuthenticationPort {

    private final AuthenticationManager authenticationManager;

    @Override
    public AuthenticatedUser authenticate(String email, String password) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
        try {
            var authentication = authenticationManager.authenticate(authenticationToken);
            var customUserDetails = (CustomUserDetails) authentication.getPrincipal();

            return new AuthenticatedUser(customUserDetails.getId());
        } catch (BadCredentialsException e) {
            log.info("A BadCredentialsException has occurred for {}", kv("email", email));
            throw new AuthenticationInvalidCredentialsValidationException();
        }
    }
}
