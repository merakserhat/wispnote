package com.wispnote.backend.adapter.messagepublisher.rabbitmq.publisher;

import com.wispnote.backend.adapter.messagepublisher.rabbitmq.config.MessagePublisherProperties;
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
        publish(message);
    }

    @Override
    public void publishNoteDeleted(NoteChangedMessage message) {
        publish(message);
    }

    private void publish(NoteChangedMessage message) {
        log.info("Publishing note message {} {}",
                kv("eventType", message.eventType()),
                kv("noteId", message.noteId()));
        var correlation = new CorrelationData(message.eventId().toString());

        try {
            rabbitTemplate.convertAndSend(properties.getNotesExchange(), message.eventType(), message, amqpMessage -> {
                var props = amqpMessage.getMessageProperties();
                props.setMessageId(message.eventId().toString());
                props.setType(message.eventType());
                props.setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                return amqpMessage;
            }, correlation);
        } catch (AmqpException e) {
            log.error("Note message publish failed, note is already committed {}", kv("eventId", message.eventId()), e);
            return;
        }

        correlation.getFuture().orTimeout(5, TimeUnit.SECONDS).whenComplete((confirm, failure) -> {
            var returned = correlation.getReturned();

            if (failure != null) {
                log.error("Note message not confirmed {}", kv("eventId", message.eventId()), failure);
            } else if (returned != null) {
                log.error("Note message unroutable {} {}", kv("eventId", message.eventId()),
                        kv("replyText", returned.getReplyText()));
            } else if (!confirm.ack()) {
                log.error("Note message rejected {} {}", kv("eventId", message.eventId()), kv("reason", confirm.reason()));
            }
        });
    }
}
