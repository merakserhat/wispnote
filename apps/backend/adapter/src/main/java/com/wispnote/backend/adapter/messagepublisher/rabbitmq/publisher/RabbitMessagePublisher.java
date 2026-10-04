package com.wispnote.backend.adapter.messagepublisher.rabbitmq.publisher;

import com.wispnote.backend.adapter.messagepublisher.rabbitmq.config.MessagePublisherProperties;
import com.wispnote.backend.application.messagepublisher.model.AutomationChangedMessage;
import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;
import com.wispnote.backend.application.messagepublisher.port.MessagePublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "message-publisher.provider", havingValue = "rabbitmq", matchIfMissing = true)
public class RabbitMessagePublisher implements MessagePublisherPort {

    private final RabbitTemplate rabbitTemplate;
    private final MessagePublisherProperties properties;

    @Override
    public void publishNoteCreated(NoteChangedMessage message) {
        log.info("Publishing note message {} {}", kv("eventType", message.eventType()), kv("noteId", message.noteId()));
        publish(properties.getNotesExchange(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishNoteDeleted(NoteChangedMessage message) {
        log.info("Publishing note message {} {}", kv("eventType", message.eventType()), kv("noteId", message.noteId()));
        publish(properties.getNotesExchange(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishAutomationCreated(AutomationChangedMessage message) {
        log.info("Publishing automation message {} {}", kv("eventType", message.eventType()), kv("automationId", message.automationId()));
        publish(properties.getAutomationsExchange(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishAutomationUpdated(AutomationChangedMessage message) {
        log.info("Publishing automation message {} {}", kv("eventType", message.eventType()), kv("automationId", message.automationId()));
        publish(properties.getAutomationsExchange(), message.eventType(), message.eventId(), message);
    }

    private void publish(String exchange, String eventType, UUID eventId, Object message) {
        var correlation = new CorrelationData(eventId.toString());

        try {
            rabbitTemplate.convertAndSend(exchange, eventType, message, amqpMessage -> {
                var props = amqpMessage.getMessageProperties();
                props.setMessageId(eventId.toString());
                props.setType(eventType);
                props.setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                return amqpMessage;
            }, correlation);
        } catch (AmqpException e) {
            log.error("Message publish failed, change is already committed {} {}", kv("eventType", eventType), kv("eventId", eventId), e);
            return;
        }

        correlation.getFuture().orTimeout(5, TimeUnit.SECONDS).whenComplete((confirm, failure) -> {
            var returned = correlation.getReturned();

            if (failure != null) {
                log.error("Message not confirmed {} {}", kv("eventType", eventType), kv("eventId", eventId), failure);
            } else if (returned != null) {
                log.error("Message unroutable {} {} {}", kv("eventType", eventType), kv("eventId", eventId),
                        kv("replyText", returned.getReplyText()));
            } else if (!confirm.ack()) {
                log.error("Message rejected {} {} {}", kv("eventType", eventType), kv("eventId", eventId), kv("reason", confirm.reason()));
            }
        });
    }
}
