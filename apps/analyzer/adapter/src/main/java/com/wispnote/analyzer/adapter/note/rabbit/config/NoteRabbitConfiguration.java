package com.wispnote.analyzer.adapter.note.rabbit.config;

import com.wispnote.analyzer.adapter.common.event.config.rabbit.RabbitMqProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "rabbitmq.enabled", havingValue = "true")
public class NoteRabbitConfiguration {

    public static final String NOTE_CREATED = "note.created";
    public static final String NOTE_DELETED = "note.deleted";

    private final RabbitMqProperties rabbitMqProperties;

    @Bean
    Declarables noteTopology() {
        var exchange = new TopicExchange(rabbitMqProperties.getNotesExchange(), true, false);
        var queue = QueueBuilder.durable(rabbitMqProperties.getNotesQueue()).build();
        return new Declarables(exchange, queue,
                BindingBuilder.bind(queue).to(exchange).with(NOTE_CREATED),
                BindingBuilder.bind(queue).to(exchange).with(NOTE_DELETED));
    }
}
