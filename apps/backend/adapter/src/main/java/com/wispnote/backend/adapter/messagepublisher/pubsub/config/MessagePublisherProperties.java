package com.wispnote.backend.adapter.messagepublisher.pubsub.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "message-publisher")
public class MessagePublisherProperties {
    private String provider;
    private String notesTopic;
    private String automationsTopic;
    private Duration publishTimeout;
}
