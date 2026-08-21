package com.wispnote.analyzer.adapter.note.rabbit.config;

import com.wispnote.analyzer.adapter.common.event.config.rabbit.RabbitMqProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "rabbitmq.enabled", havingValue = "true")
public class NoteRabbitConfiguration {

    private final RabbitMqProperties rabbitMqProperties;

    @Bean
    TopicExchange noteCreatedExchange() {
        return new TopicExchange(rabbitMqProperties.getNoteCreatedExchange());
    }

    @Bean
    Queue noteCreatedQueue() {
        return QueueBuilder.durable(rabbitMqProperties.getNoteCreatedQueue())
                .classic()
                .build();
    }

    @Bean
    Binding noteCreatedBinding(TopicExchange noteCreatedExchange, Queue noteCreatedQueue) {
        return BindingBuilder.bind(noteCreatedQueue)
                .to(noteCreatedExchange)
                .with(rabbitMqProperties.getNoteCreatedRoutingKey());
    }
}
