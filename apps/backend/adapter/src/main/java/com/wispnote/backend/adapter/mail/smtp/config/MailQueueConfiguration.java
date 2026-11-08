package com.wispnote.backend.adapter.mail.smtp.config;

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
@ConditionalOnProperty(name = "mail.provider", havingValue = "smtp")
public class MailQueueConfiguration {

    public static final String MAIL_SEND = "mail.send";

    private final MailProperties properties;

    @Bean
    Declarables mailTopology() {
        var exchange = new TopicExchange(properties.getExchange(), true, false);
        var queue = QueueBuilder.durable(properties.getQueue()).build();
        return new Declarables(exchange, queue, BindingBuilder.bind(queue).to(exchange).with(MAIL_SEND));
    }
}
