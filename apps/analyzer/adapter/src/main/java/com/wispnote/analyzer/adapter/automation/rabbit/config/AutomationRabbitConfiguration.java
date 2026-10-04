package com.wispnote.analyzer.adapter.automation.rabbit.config;

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
public class AutomationRabbitConfiguration {

    public static final String AUTOMATION_CREATED = "automation.created";
    public static final String AUTOMATION_UPDATED = "automation.updated";

    private final RabbitMqProperties rabbitMqProperties;

    @Bean
    Declarables automationTopology() {
        var exchange = new TopicExchange(rabbitMqProperties.getAutomationsExchange(), true, false);
        var queue = QueueBuilder.durable(rabbitMqProperties.getAutomationsQueue()).build();
        return new Declarables(exchange, queue,
                BindingBuilder.bind(queue).to(exchange).with(AUTOMATION_CREATED),
                BindingBuilder.bind(queue).to(exchange).with(AUTOMATION_UPDATED));
    }
}
