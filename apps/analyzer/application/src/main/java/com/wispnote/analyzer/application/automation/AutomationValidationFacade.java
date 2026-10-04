package com.wispnote.analyzer.application.automation;

import com.wispnote.analyzer.application.automation.model.AutomationChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationValidationFacade {

    public void validateAutomation(AutomationChangedEvent automationChangedEvent) {
        log.info("Validating automation {} {} {}",
                kv("automationId", automationChangedEvent.automationId()),
                kv("memberId", automationChangedEvent.memberId()),
                kv("kind", automationChangedEvent.kind()));
    }
}
