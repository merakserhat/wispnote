package com.wispnote.backend.adapter.messagepublisher.pubsub.publisher;

import com.google.cloud.spring.pubsub.core.PubSubTemplate;
import com.wispnote.backend.adapter.messagepublisher.pubsub.config.MessagePublisherProperties;
import com.wispnote.backend.application.messagepublisher.model.AutomationChangedMessage;
import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;
import com.wispnote.backend.application.messagepublisher.port.MessagePublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "message-publisher.provider", havingValue = "pubsub")
public class PubSubMessagePublisher implements MessagePublisherPort {

    private static final String EVENT_TYPE = "eventType";

    private final PubSubTemplate pubSubTemplate;
    private final JsonMapper jsonMapper;
    private final MessagePublisherProperties properties;

    @Override
    public void publishNoteCreated(NoteChangedMessage message) {
        log.info("Publishing note message {} {}", kv("eventType", message.eventType()), kv("noteId", message.noteId()));
        publish(properties.getNotesTopic(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishNoteDeleted(NoteChangedMessage message) {
        log.info("Publishing note message {} {}", kv("eventType", message.eventType()), kv("noteId", message.noteId()));
        publish(properties.getNotesTopic(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishAutomationCreated(AutomationChangedMessage message) {
        log.info("Publishing automation message {} {}", kv("eventType", message.eventType()), kv("automationId", message.automationId()));
        publish(properties.getAutomationsTopic(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishAutomationUpdated(AutomationChangedMessage message) {
        log.info("Publishing automation message {} {}", kv("eventType", message.eventType()), kv("automationId", message.automationId()));
        publish(properties.getAutomationsTopic(), message.eventType(), message.eventId(), message);
    }

    private void publish(String topic, String eventType, UUID eventId, Object message) {
        try {
            var payload = jsonMapper.writeValueAsString(message);
            var messageId = pubSubTemplate.publish(topic, payload, Map.of(EVENT_TYPE, eventType))
                    .get(properties.getPublishTimeout().toMillis(), TimeUnit.MILLISECONDS);
            log.info("Message published {} {} {}", kv("topic", topic), kv("eventId", eventId), kv("messageId", messageId));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Message publish interrupted {} {} {}", kv("topic", topic), kv("eventType", eventType), kv("eventId", eventId), e);
        } catch (ExecutionException | TimeoutException | RuntimeException e) {
            log.error("Message publish failed {} {} {}", kv("topic", topic), kv("eventType", eventType), kv("eventId", eventId), e);
        }
    }
}
