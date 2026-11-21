package com.wispnote.analyzer.adapter.common.event.pubsub.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "pubsub.push")
public class PubSubPushProperties {
    private PubSubPushVerification verification = PubSubPushVerification.GOOGLE;
    private String issuer;
    private String jwkSetUri;
    private String audience;
    private String serviceAccountEmail;
}
