package com.wispnote.backend.adapter.messagepublisher.rabbitmq.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "message-publisher")
public class MessagePublisherProperties {
    private String provider;
    private String notesExchange;
    private String analyzerQueue;
}
