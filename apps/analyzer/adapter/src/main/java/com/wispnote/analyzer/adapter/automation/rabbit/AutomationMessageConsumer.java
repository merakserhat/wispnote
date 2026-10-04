package com.wispnote.analyzer.adapter.automation.rabbit;

import com.wispnote.analyzer.adapter.automation.rabbit.message.AutomationChangedMessage;
import com.wispnote.analyzer.application.automation.AutomationValidationFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "rabbitmq.enabled", havingValue = "true")
public class AutomationMessageConsumer {

    private final AutomationValidationFacade automationValidationFacade;

    @RabbitListener(queues = "${rabbitmq.automations-queue}")
    public void consumeAutomationChangedMessage(@Payload AutomationChangedMessage message) {
        log.info("Received automation message {} {} {}",
                kv("eventId", message.eventId()),
                kv("eventType", message.eventType()),
                kv("automationId", message.automationId()));

        var event = message.toModel();
        automationValidationFacade.validateAutomation(event);
    }
}
