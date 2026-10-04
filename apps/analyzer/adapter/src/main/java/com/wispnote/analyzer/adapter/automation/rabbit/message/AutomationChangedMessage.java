package com.wispnote.analyzer.adapter.automation.rabbit.message;

import com.wispnote.analyzer.adapter.automation.converter.AutomationEventKindConverter;
import com.wispnote.analyzer.application.automation.model.AutomationChangedEvent;

import java.time.Instant;
import java.util.UUID;

public record AutomationChangedMessage(UUID eventId,
                                       String eventType,
                                       Instant occurredAt,
                                       UUID automationId,
                                       UUID memberId) {

    public AutomationChangedEvent toModel() {
        return new AutomationChangedEvent(
                eventId,
                AutomationEventKindConverter.rabbit.toEnum(eventType),
                occurredAt,
                automationId,
                memberId
        );
    }
}
