package com.wispnote.backend.adapter.analyzer.config;

import com.wispnote.backend.adapter.analyzer.AnalyzerRestClient;
import com.wispnote.backend.adapter.analyzer.exception.AnalyzerClientErrorHandler;
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
@ConditionalOnProperty(name = "analyzer.provider", havingValue = "rest", matchIfMissing = true)
public class AnalyzerRestClientConfiguration {

    private final AnalyzerProperties analyzerProperties;

    @Bean
    AnalyzerRestClient analyzerRestClient(OAuth2AuthorizedClientManager authorizedClientManager,
                                          AnalyzerClientErrorHandler errorHandler) {
        var requestFactory = new JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(analyzerProperties.getReadTimeout());

        var requestInterceptor = new OAuth2ClientHttpRequestInterceptor(authorizedClientManager);
        requestInterceptor.setPrincipalResolver(new RequestAttributePrincipalResolver());

        var registrationId = analyzerProperties.getClientRegistrationId();
        var restClient = RestClient.builder()
                .requestInterceptor(requestInterceptor)
                .defaultStatusHandler(errorHandler)
                .defaultRequest(request -> request
                        .attributes(clientRegistrationId(registrationId))
                        .attributes(principal(registrationId)))
                .baseUrl(analyzerProperties.getBaseUrl())
                .requestFactory(requestFactory)
                .build();

        var factory = HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient)).build();
        return factory.createClient(AnalyzerRestClient.class);
    }
}
