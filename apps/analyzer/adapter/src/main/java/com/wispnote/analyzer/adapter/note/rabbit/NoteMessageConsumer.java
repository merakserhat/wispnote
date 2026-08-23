package com.wispnote.analyzer.adapter.note.rabbit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "rabbitmq.enabled", havingValue = "true")
public class NoteMessageConsumer {

    @RabbitListener(queues = "${rabbitmq.note-created-queue}")
    public void consumeNoteCreatedMessage(Message message) {
        String payload = new String(message.getBody(), StandardCharsets.UTF_8);
        log.info("Received note created message {}", kv("payload", payload));
    }

    @RabbitListener(queues = "${rabbitmq.note-enriched-queue}")
    public void consumeNoteEnrichedMessage(Message message) {
        String payload = new String(message.getBody(), StandardCharsets.UTF_8);
        log.info("Received note enriched message {}", kv("payload", payload));
    }
}
