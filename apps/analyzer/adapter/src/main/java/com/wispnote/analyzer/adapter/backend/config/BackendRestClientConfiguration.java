package com.wispnote.analyzer.adapter.backend.config;

import com.wispnote.analyzer.adapter.backend.BackendRestClient;
import com.wispnote.analyzer.adapter.backend.exception.BackendClientErrorHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.client.OAuth2ClientHttpRequestInterceptor;
import org.springframework.security.oauth2.client.web.client.RequestAttributePrincipalResolver;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import static org.springframework.security.oauth2.client.web.client.RequestAttributeClientRegistrationIdResolver.clientRegistrationId;
import static org.springframework.security.oauth2.client.web.client.RequestAttributePrincipalResolver.principal;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "backend.provider", havingValue = "rest", matchIfMissing = true)
public class BackendRestClientConfiguration {

    private final BackendProperties backendProperties;

    @Bean
    BackendRestClient backendRestClient(OAuth2AuthorizedClientManager authorizedClientManager,
                                        BackendClientErrorHandler errorHandler) {
        var requestFactory = new JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(backendProperties.getReadTimeout());

        var requestInterceptor = new OAuth2ClientHttpRequestInterceptor(authorizedClientManager);
        requestInterceptor.setPrincipalResolver(new RequestAttributePrincipalResolver());

        var registrationId = backendProperties.getClientRegistrationId();
        var restClient = RestClient.builder()
                .requestInterceptor(requestInterceptor)
                .defaultStatusHandler(errorHandler)
                .defaultRequest(request -> request
                        .attributes(clientRegistrationId(registrationId))
                        .attributes(principal(registrationId)))
                .baseUrl(backendProperties.getBaseUrl())
                .requestFactory(requestFactory)
                .build();

        var factory = HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient)).build();
        return factory.createClient(BackendRestClient.class);
    }
}
