package com.wispnote.backend.application.automation.event;

import com.wispnote.backend.application.messagepublisher.model.AutomationChangedMessage;

public record AutomationCreatedEvent(AutomationChangedMessage message) {
}
