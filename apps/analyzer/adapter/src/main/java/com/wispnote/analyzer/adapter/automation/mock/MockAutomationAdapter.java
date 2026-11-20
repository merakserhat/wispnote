package com.wispnote.analyzer.adapter.automation.mock;

import java.util.List;
import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automation.port.AutomationPort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "backend.provider", havingValue = "mock")
public class MockAutomationAdapter implements AutomationPort {

    @Override
    public Automation retrieveById(UUID memberId, UUID automationId) {
        var now = Instant.now();
        return new Automation(automationId,
                memberId,
                "mock rule text",
                true,
                now,
                now);
    }

    @Override
    public List<Automation> findAllEnabledByMemberId(UUID memberId) {
        return List.of(retrieveById(memberId, UUID.randomUUID()));
    }
}
