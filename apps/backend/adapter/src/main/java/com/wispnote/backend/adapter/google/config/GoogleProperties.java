package com.wispnote.backend.adapter.google.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "google")
public class GoogleProperties {
    private String provider;
    private String clientId;
    private String clientSecret;
    private String tokenUri;
    private String issuer;
    private String jwkSetUri;
    private Duration readTimeout;
}
