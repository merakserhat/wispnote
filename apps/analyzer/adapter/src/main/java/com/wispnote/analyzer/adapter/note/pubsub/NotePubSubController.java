package com.wispnote.analyzer.adapter.note.pubsub;

import com.wispnote.analyzer.adapter.common.event.pubsub.request.PubSubPushRequest;
import com.wispnote.analyzer.adapter.note.message.NoteChangedMessage;
import com.wispnote.analyzer.application.note.enums.NoteEventKind;
import com.wispnote.analyzer.application.noteautomationrun.service.NoteAutomationRunTriggerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.json.JsonMapper;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/pubsub")
public class NotePubSubController {

    private final NoteAutomationRunTriggerService noteAutomationRunTriggerService;
    private final JsonMapper jsonMapper;

    @PostMapping("/notes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void receiveNoteChangedMessage(@RequestBody PubSubPushRequest request) {
        var message = jsonMapper.readValue(request.message().decodedData(), NoteChangedMessage.class);

        log.info("Received note message {} {} {} {}",
                kv("eventId", message.eventId()),
                kv("eventType", message.eventType()),
                kv("noteId", message.noteId()),
                kv("deliveryAttempt", request.deliveryAttempt()));

        var event = message.toModel();

        if (event.kind() == NoteEventKind.CREATED) {
            noteAutomationRunTriggerService.trigger(event);
        }
    }
}
