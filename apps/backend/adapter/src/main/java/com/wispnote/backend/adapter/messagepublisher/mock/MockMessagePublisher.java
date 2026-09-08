package com.wispnote.backend.adapter.messagepublisher.mock;

import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;
import com.wispnote.backend.application.messagepublisher.port.MessagePublisherPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "message-publisher.provider", havingValue = "mock")
public class MockMessagePublisher implements MessagePublisherPort {

    @Override
    public void publishNoteCreated(NoteChangedMessage message) {
        log.info("Mock note.created {} {}", kv("eventId", message.eventId()), kv("noteId", message.noteId()));
    }

    @Override
    public void publishNoteDeleted(NoteChangedMessage message) {
        log.info("Mock note.deleted {} {}", kv("eventId", message.eventId()), kv("noteId", message.noteId()));
    }
}
