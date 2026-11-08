package com.wispnote.backend.adapter.messagepublisher.rabbitmq.publisher;

import com.wispnote.backend.adapter.common.rabbit.RabbitPublisher;
import com.wispnote.backend.adapter.messagepublisher.rabbitmq.config.MessagePublisherProperties;
import com.wispnote.backend.application.messagepublisher.model.AutomationChangedMessage;
import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;
import com.wispnote.backend.application.messagepublisher.port.MessagePublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "message-publisher.provider", havingValue = "rabbitmq", matchIfMissing = true)
public class RabbitMessagePublisher implements MessagePublisherPort {

    private final RabbitPublisher rabbitPublisher;
    private final MessagePublisherProperties properties;

    @Override
    public void publishNoteCreated(NoteChangedMessage message) {
        log.info("Publishing note message {} {}", kv("eventType", message.eventType()), kv("noteId", message.noteId()));
        rabbitPublisher.publish(properties.getNotesExchange(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishNoteDeleted(NoteChangedMessage message) {
        log.info("Publishing note message {} {}", kv("eventType", message.eventType()), kv("noteId", message.noteId()));
        rabbitPublisher.publish(properties.getNotesExchange(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishAutomationCreated(AutomationChangedMessage message) {
        log.info("Publishing automation message {} {}", kv("eventType", message.eventType()), kv("automationId", message.automationId()));
        rabbitPublisher.publish(properties.getAutomationsExchange(), message.eventType(), message.eventId(), message);
    }

    @Override
    public void publishAutomationUpdated(AutomationChangedMessage message) {
        log.info("Publishing automation message {} {}", kv("eventType", message.eventType()), kv("automationId", message.automationId()));
        rabbitPublisher.publish(properties.getAutomationsExchange(), message.eventType(), message.eventId(), message);
    }
}
