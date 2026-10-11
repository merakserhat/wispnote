package com.wispnote.analyzer.application.automationcheckrun;

import com.wispnote.analyzer.application.automation.port.AutomationPort;
import com.wispnote.analyzer.application.automation.model.AutomationChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationValidationFacade {

    private final AutomationPort automationPort;

    public void validateAutomation(AutomationChangedEvent automationChangedEvent) {
        log.info("Validating automation {} {} {}",
                kv("automationId", automationChangedEvent.automationId()),
                kv("memberId", automationChangedEvent.memberId()),
                kv("kind", automationChangedEvent.kind()));

        var automation = automationPort.retrieveById(automationChangedEvent.memberId(), automationChangedEvent.automationId());
        log.info("Automation retrieved {} {} {}",
                kv("automationId", automation.id()),
                kv("ruleText", automation.ruleText()),
                kv("enabled", automation.enabled()));
    }
}
