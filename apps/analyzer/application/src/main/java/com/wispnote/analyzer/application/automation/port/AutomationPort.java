package com.wispnote.analyzer.application.automation.port;

import com.wispnote.analyzer.application.automation.model.Automation;

import java.util.UUID;

public interface AutomationPort {
    Automation retrieveById(UUID memberId, UUID automationId);
}
