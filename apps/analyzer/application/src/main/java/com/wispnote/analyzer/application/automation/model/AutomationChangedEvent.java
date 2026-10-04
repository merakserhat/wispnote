package com.wispnote.analyzer.application.automation.model;

import com.wispnote.analyzer.application.automation.enums.AutomationEventKind;

import java.time.Instant;
import java.util.UUID;

public record AutomationChangedEvent(UUID eventId,
                                     AutomationEventKind kind,
                                     Instant occurredAt,
                                     UUID automationId,
                                     UUID memberId) {
}
