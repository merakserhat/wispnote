package com.wispnote.backend.adapter.google;

import com.wispnote.backend.adapter.google.config.GoogleProperties;
import com.wispnote.backend.adapter.google.exception.GoogleClientException;
import com.wispnote.backend.application.auth.model.GoogleIdentity;
import com.wispnote.backend.application.auth.port.GoogleIdentityPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "google.provider", havingValue = "rest")
public class GoogleIdentityRestAdapter implements GoogleIdentityPort {

    private final GoogleTokenRestClient googleTokenRestClient;
    private final JwtDecoder googleIdTokenDecoder;
    private final GoogleProperties properties;

    @Override
    public GoogleIdentity exchange(String code, String codeVerifier, String redirectUri) {
        var form = new LinkedMultiValueMap<String, String>();
        form.add("grant_type", "authorization_code");
        form.add("code", code);
        form.add("code_verifier", codeVerifier);
        form.add("redirect_uri", redirectUri);
        form.add("client_id", properties.getClientId());
        form.add("client_secret", properties.getClientSecret());

        var response = googleTokenRestClient.exchange(form);

        try {
            var idToken = googleIdTokenDecoder.decode(response.idToken());
            var identity = new GoogleIdentity(idToken.getSubject(), idToken.getClaimAsString("email"),
                    Boolean.TRUE.equals(idToken.getClaimAsBoolean("email_verified")));

            log.info("Google identity resolved {} {}", kv("subject", identity.subject()), kv("email", identity.email()));
            return identity;
        } catch (JwtException e) {
            log.warn("Google id token rejected", e);
            throw new GoogleClientException("errors.googleLogin.failed", e);
        }
    }
}
