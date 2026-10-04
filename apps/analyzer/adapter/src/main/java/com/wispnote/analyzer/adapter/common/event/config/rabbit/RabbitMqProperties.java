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
    private String notesExchange;
    private String notesQueue;
    private String automationsExchange;
    private String automationsQueue;
}
