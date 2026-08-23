package com.wispnote.analyzer.adapter.note.rabbit;

import com.wispnote.analyzer.adapter.note.rabbit.message.NoteMessage;
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

    @RabbitListener(queues = "${rabbitmq.note-created-queue}")
    public void consumeNoteCreatedMessage(@Payload NoteMessage message) {
        log.info("Received note created message {} {} {}",
                kv("eventId", message.eventId()),
                kv("eventType", message.eventType()),
                kv("noteId", message.note().id()));
        noteAnalyzerFacade.analyzeNote(message.toModel());    }

    @RabbitListener(queues = "${rabbitmq.note-enriched-queue}")
    public void consumeNoteEnrichedMessage(@Payload NoteMessage message) {
        log.info("Received note enriched message {} {} {}",
                kv("eventId", message.eventId()),
                kv("eventType", message.eventType()),
                kv("noteId", message.note().id()));
        noteAnalyzerFacade.analyzeNote(message.toModel());
    }
}
