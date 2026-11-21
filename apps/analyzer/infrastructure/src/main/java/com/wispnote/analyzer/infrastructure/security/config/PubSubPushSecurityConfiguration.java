package com.wispnote.analyzer.infrastructure.security.config;

import com.wispnote.analyzer.adapter.common.event.pubsub.config.PubSubPushProperties;
import com.wispnote.analyzer.adapter.common.event.pubsub.config.PubSubPushVerification;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

import static com.wispnote.analyzer.infrastructure.security.config.SecurityConfiguration.hardened;

@Configuration
@RequiredArgsConstructor
public class PubSubPushSecurityConfiguration {

    private final PubSubPushProperties properties;

    @Bean
    @Order(0)
    public SecurityFilterChain pubSubEndpoints(HttpSecurity http) throws Exception {
        var pubSubHttp = hardened(http.securityMatcher("/pubsub/**"));

        if (properties.getVerification() == PubSubPushVerification.NONE) {
            return pubSubHttp
                    .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
                    .oauth2ResourceServer(AbstractHttpConfigurer::disable)
                    .build();
        }

        var googleJwtDecoder = googleJwtDecoder();

        return pubSubHttp
                .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.decoder(googleJwtDecoder)))
                .build();
    }

    private JwtDecoder googleJwtDecoder() {
        var decoder = NimbusJwtDecoder.withJwkSetUri(properties.getJwkSetUri()).build();

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(properties.getIssuer()),
                new JwtClaimValidator<List<String>>("aud", audience -> audience.contains(properties.getAudience())),
                new JwtClaimValidator<String>("email", email -> email.equals(properties.getServiceAccountEmail())),
                new JwtClaimValidator<Boolean>("email_verified", Boolean.TRUE::equals)));

        return decoder;
    }
}
