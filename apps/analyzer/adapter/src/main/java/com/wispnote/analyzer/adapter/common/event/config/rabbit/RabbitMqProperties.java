package com.wispnote.analyzer.adapter.common.event.config.rabbit;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "rabbitmq")
public class RabbitMqProperties {
    private boolean enabled;
    private String deadLetterExchange;
    private String noteCreatedExchange;
    private String noteCreatedQueue;
    private String noteCreatedRoutingKey;
    private String noteEnrichedExchange;
    private String noteEnrichedQueue;
    private String noteEnrichedRoutingKey;
}
