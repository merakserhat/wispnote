package com.wispnote.analyzer.adapter.note.rabbit.message;

import com.wispnote.analyzer.application.note.enums.NoteEventKind;
import com.wispnote.analyzer.application.note.enums.NoteKind;
import com.wispnote.analyzer.application.note.enums.SourceKind;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import tools.jackson.databind.json.JsonMapper;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Both queues bind to the same {@link NoteMessage}, so these cases also pin down that {@code eventType} is
 * what separates a creation from an enrichment. Binds the payloads exactly as the {@code @RabbitListener} does: the converter resolves the target
 * type from the listener's inferred argument type, so no explicit deserialization call is involved.
 */
class NoteMessageBindingTest {

    private static final String NOTE_CREATED_PAYLOAD = """
            {"eventId": "77017dd2-e75c-41c4-ab28-c6eaaffd5b0b", "eventType": "note.created", "schemaVersion": 1, "occurredAt": "2026-08-23T14:04:53", "note": {"id": 82, "sourceId": 21, "kind": "highlight", "selectedText": "A delayed result-bearing action that can be cancelled.", "userNote": "", "contextBefore": "before", "contextAfter": "after", "section": "", "pageNumber": null, "appName": "Google Chrome", "windowTitle": "ScheduledFuture (Java Platform SE 8 ) - Google Chrome - Serhat", "createdAt": "2026-08-23T14:04:53"}, "source": {"id": 21, "kind": "web", "key": "web:https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledFuture.html", "title": "ScheduledFuture (Java Platform SE 8 )", "url": "https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledFuture.html", "filePath": null}}
            """;

    private static final String NOTE_ENRICHED_PAYLOAD = """
            {"eventId": "4142ebdf-5532-4fcc-bc8d-fc113f2de265", "eventType": "note.enriched", "schemaVersion": 1, "occurredAt": "2026-08-23T14:12:10", "note": {"id": 87, "sourceId": 2, "kind": "highlight", "selectedText": "will leverage. Some readers might ask why not building everything by ourselves? Reasons", "userNote": "", "contextBefore": "before", "contextAfter": "after", "section": "CHAPTER 14: DESIGN YOUTUBE", "pageNumber": 223, "appName": "Preview", "windowTitle": "SystemDesignInterview.pdf \\u2013 Page 222 of 269", "createdAt": "2026-08-23T14:12:09"}, "source": {"id": 2, "kind": "pdf", "key": "pdf:/Users/serhatmerak/Desktop/SystemDesignInterview.pdf", "title": "System Design Interview", "url": null, "filePath": "/Users/serhatmerak/Desktop/SystemDesignInterview.pdf"}}
            """;

    private final MessageConverter messageConverter = new JacksonJsonMessageConverter(JsonMapper.builder().build());

    @Test
    void shouldBindNoteCreatedPayloadToModel() {
        var event = convert(NOTE_CREATED_PAYLOAD, "note.created", NoteMessage.class).toModel();

        assertThat(event.eventId()).isEqualTo(UUID.fromString("77017dd2-e75c-41c4-ab28-c6eaaffd5b0b"));
        assertThat(event.kind()).isEqualTo(NoteEventKind.CREATED);
        assertThat(event.schemaVersion()).isEqualTo(1);
        assertThat(event.occurredAt()).isEqualTo(LocalDateTime.parse("2026-08-23T14:04:53"));
        assertThat(event.note().id()).isEqualTo(82L);
        assertThat(event.note().sourceId()).isEqualTo(21L);
        assertThat(event.note().kind()).isEqualTo(NoteKind.HIGHLIGHT);
        assertThat(event.note().pageNumber()).isNull();
        assertThat(event.note().windowTitle()).contains("ScheduledFuture");
        assertThat(event.source().kind()).isEqualTo(SourceKind.WEB);
        assertThat(event.source().filePath()).isNull();
    }

    @Test
    void shouldBindNoteEnrichedPayloadToModel() {
        var event = convert(NOTE_ENRICHED_PAYLOAD, "note.enriched", NoteMessage.class).toModel();

        assertThat(event.eventId()).isEqualTo(UUID.fromString("4142ebdf-5532-4fcc-bc8d-fc113f2de265"));
        assertThat(event.kind()).isEqualTo(NoteEventKind.ENRICHED);
        assertThat(event.occurredAt()).isEqualTo(LocalDateTime.parse("2026-08-23T14:12:10"));
        assertThat(event.note().id()).isEqualTo(87L);
        assertThat(event.note().kind()).isEqualTo(NoteKind.HIGHLIGHT);
        assertThat(event.note().section()).isEqualTo("CHAPTER 14: DESIGN YOUTUBE");
        assertThat(event.note().pageNumber()).isEqualTo(223);
        assertThat(event.source().kind()).isEqualTo(SourceKind.PDF);
        assertThat(event.source().url()).isNull();
        assertThat(event.source().filePath()).endsWith("SystemDesignInterview.pdf");
    }

    @Test
    void shouldBindPayloadWithoutSource() {
        var payloadWithoutSource = NOTE_CREATED_PAYLOAD.replaceFirst("\"source\": \\{.*}}", "\"source\": null}");

        var event = convert(payloadWithoutSource, "note.created", NoteMessage.class).toModel();

        assertThat(event.source()).isNull();
        assertThat(event.note().kind()).isEqualTo(NoteKind.HIGHLIGHT);
    }

    @Test
    void shouldIgnoreUnknownFieldsAsTheContractAllowsThem() {
        var payloadWithNewField = NOTE_CREATED_PAYLOAD.replaceFirst("\"eventId\"", "\"bundleId\": \"com.google.Chrome\", \"eventId\"");

        var event = convert(payloadWithNewField, "note.created", NoteMessage.class).toModel();

        assertThat(event.note().id()).isEqualTo(82L);
    }

    private <T> T convert(String payload, String eventType, Class<T> messageType) {
        var messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
        messageProperties.setType(eventType);
        messageProperties.setInferredArgumentType(messageType);

        var message = new Message(payload.getBytes(StandardCharsets.UTF_8), messageProperties);

        return messageType.cast(messageConverter.fromMessage(message));
    }
}
