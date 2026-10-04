package com.wispnote.backend.application.messagepublisher.model;

import com.wispnote.backend.application.automation.model.Automation;

import java.time.Instant;
import java.util.UUID;

public record AutomationChangedMessage(UUID eventId,
                                       String eventType,
                                       Instant occurredAt,
                                       UUID automationId,
                                       UUID memberId) {

    public static AutomationChangedMessage created(Automation automation) {
        return of("automation.created", automation);
    }

    public static AutomationChangedMessage updated(Automation automation) {
        return of("automation.updated", automation);
    }

    private static AutomationChangedMessage of(String eventType, Automation automation) {
        return new AutomationChangedMessage(UUID.randomUUID(),
                eventType,
                Instant.now(),
                automation.id(),
                automation.memberId());
    }
}
