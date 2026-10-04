package com.wispnote.analyzer.adapter.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "backend")
public class BackendProperties {
    private String provider;
    private String baseUrl;
    private Duration readTimeout;
    private String clientRegistrationId;
}
