package com.wispnote.analyzer.adapter.note.rabbit;

import com.wispnote.analyzer.adapter.note.rabbit.message.NoteChangedMessage;
import com.wispnote.analyzer.application.note.NoteAnalyzerFacade;
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
public class NoteMessageConsumer {

    private final NoteAnalyzerFacade noteAnalyzerFacade;

    @RabbitListener(queues = "${rabbitmq.notes-queue}")
    public void consumeNoteChangedMessage(@Payload NoteChangedMessage message) {
        log.info("Received note message {} {} {}",
                kv("eventId", message.eventId()),
                kv("eventType", message.eventType()),
                kv("noteId", message.noteId()));

        var event = message.toModel();
        switch (event.kind()) {
            case CREATED -> noteAnalyzerFacade.analyzeNote(event);
            case DELETED -> noteAnalyzerFacade.forgetNote(event);
        }
    }
}
