package com.wispnote.backend.adapter.google.config;

import com.wispnote.backend.adapter.google.GoogleTokenRestClient;
import com.wispnote.backend.adapter.google.exception.GoogleClientErrorHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "google.provider", havingValue = "rest")
public class GoogleRestClientConfiguration {

    private final GoogleProperties googleProperties;

    @Bean
    GoogleTokenRestClient googleTokenRestClient(GoogleClientErrorHandler errorHandler) {
        var requestFactory = new JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(googleProperties.getReadTimeout());

        var restClient = RestClient.builder()
                .defaultStatusHandler(errorHandler)
                .baseUrl(googleProperties.getTokenUri())
                .requestFactory(requestFactory)
                .build();

        var factory = HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient)).build();
        return factory.createClient(GoogleTokenRestClient.class);
    }

    @Bean
    JwtDecoder googleIdTokenDecoder() {
        var audienceValidator = new JwtClaimValidator<List<String>>(JwtClaimNames.AUD,
                audience -> audience != null && audience.contains(googleProperties.getClientId()));
        var decoder = NimbusJwtDecoder.withJwkSetUri(googleProperties.getJwkSetUri()).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<Jwt>(
                JwtValidators.createDefaultWithIssuer(googleProperties.getIssuer()),
                audienceValidator));
        return decoder;
    }
}
