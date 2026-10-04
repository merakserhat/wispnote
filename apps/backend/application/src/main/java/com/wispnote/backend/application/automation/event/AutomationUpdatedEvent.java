package com.wispnote.backend.application.automation.event;

import com.wispnote.backend.application.messagepublisher.model.AutomationChangedMessage;

public record AutomationUpdatedEvent(AutomationChangedMessage message) {
}
