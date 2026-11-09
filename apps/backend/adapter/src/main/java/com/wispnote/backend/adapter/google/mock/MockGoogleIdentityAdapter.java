package com.wispnote.backend.adapter.google.mock;

import com.wispnote.backend.adapter.google.exception.GoogleClientException;
import com.wispnote.backend.application.auth.model.GoogleIdentity;
import com.wispnote.backend.application.auth.port.GoogleIdentityPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConditionalOnProperty(name = "google.provider", havingValue = "mock", matchIfMissing = true)
public class MockGoogleIdentityAdapter implements GoogleIdentityPort {

    @Override
    public GoogleIdentity exchange(String code, String codeVerifier, String redirectUri) {
        log.info("Mock Google exchange, Google sign-in is not configured on this backend");
        throw new GoogleClientException("errors.googleLogin.failed");
    }
}
