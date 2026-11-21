package com.wispnote.analyzer.adapter.automation.pubsub;

import com.wispnote.analyzer.adapter.automation.message.AutomationChangedMessage;
import com.wispnote.analyzer.adapter.common.event.pubsub.request.PubSubPushRequest;
import com.wispnote.analyzer.application.automationcheckrun.service.AutomationCheckRunTriggerService;
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
public class AutomationPubSubController {

    private final AutomationCheckRunTriggerService automationCheckRunTriggerService;
    private final JsonMapper jsonMapper;

    @PostMapping("/automations")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void receiveAutomationChangedMessage(@RequestBody PubSubPushRequest request) {
        var message = jsonMapper.readValue(request.message().decodedData(), AutomationChangedMessage.class);

        log.info("Received automation message {} {} {} {}",
                kv("eventId", message.eventId()),
                kv("eventType", message.eventType()),
                kv("automationId", message.automationId()),
                kv("deliveryAttempt", request.deliveryAttempt()));

        var event = message.toModel();
        automationCheckRunTriggerService.trigger(event);
    }
}
