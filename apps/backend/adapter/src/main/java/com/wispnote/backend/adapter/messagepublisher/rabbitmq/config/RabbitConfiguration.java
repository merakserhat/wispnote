package com.wispnote.backend.adapter.messagepublisher.rabbitmq.config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.json.JsonMapper;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "message-publisher.provider", havingValue = "rabbitmq", matchIfMissing = true)
public class RabbitConfiguration {

    private final MessagePublisherProperties properties;

    @Bean
    Declarables noteTopology() {
        var exchange = new TopicExchange(properties.getNotesExchange(), true, false);
        var queue = QueueBuilder.durable(properties.getAnalyzerQueue()).build();
        return new Declarables(exchange, queue,
                BindingBuilder.bind(queue).to(exchange).with("note.created"),
                BindingBuilder.bind(queue).to(exchange).with("note.deleted"));
    }

    @Bean
    MessageConverter rabbitMessageConverter(JsonMapper jsonMapper) {
        return new JacksonJsonMessageConverter(jsonMapper);
    }
}
