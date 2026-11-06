package com.wispnote.backend.adapter.analyzer.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "analyzer")
public class AnalyzerProperties {
    private String provider;
    private String baseUrl;
    private Duration readTimeout;
    private String clientRegistrationId;
}
