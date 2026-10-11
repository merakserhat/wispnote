package com.wispnote.analyzer.adapter.automation.backend;

import com.wispnote.analyzer.adapter.backend.BackendRestClient;
import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automation.port.AutomationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "backend.provider", havingValue = "rest", matchIfMissing = true)
public class AutomationBackendAdapter implements AutomationPort {

    private final BackendRestClient backendRestClient;

    @Override
    public Automation retrieveById(UUID memberId, UUID automationId) {
        return backendRestClient.retrieveAutomation(memberId, automationId).result().toModel();
    }
}
