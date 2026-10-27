package com.wispnote.analyzer.application.automationcheckrun.service;

import com.wispnote.analyzer.application.automation.enums.AutomationEventKind;
import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automation.model.AutomationChangedEvent;
import com.wispnote.analyzer.application.automation.port.AutomationPort;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationFingerprint;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationCheckRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationCheckRunTriggerService {

    private final AutomationCheckRunHandlerService automationCheckRunHandlerService;
    private final AutomationCheckRunPersistencePort automationCheckRunPersistencePort;
    private final AutomationPort automationPort;

    public void trigger(AutomationChangedEvent event) {
        log.info("Triggering automation check run{} {} {}",
                kv("automationId", event.automationId()),
                kv("memberId", event.memberId()),
                kv("kind", event.kind()));

        var automation = automationPort.retrieveById(event.memberId(), event.automationId());

        if (automation.hasNoRuleText()) {
            log.warn("Automation has no rule text, skipping check run {} {}",
                    kv("automationId", automation.id()),
                    kv("memberId", automation.memberId()));
            return;
        }

        if (event.kind() == AutomationEventKind.CREATED) {
           var checkRun = createCheckRun(automation);
           automationCheckRunHandlerService.handle(checkRun, automation);
           return;
        }

        var checkRunOptional = automationCheckRunPersistencePort.findByAutomationId(event.automationId());

        if (checkRunOptional.isEmpty()) {
            var checkRun = createCheckRun(automation);
            automationCheckRunHandlerService.handle(checkRun, automation);
            return;
        }

        var checkRun = checkRunOptional.get();
        var automationFingerprint = AutomationFingerprint.of(automation);

        if (checkRun.isIdentical(automationFingerprint)) {
            log.info("Automation fingerprints are the same, skipping check run creation");
            return;
        }

        var updatedCheckRun = automationCheckRunPersistencePort.update(checkRun.updateFingerprint(automationFingerprint));

        automationCheckRunHandlerService.handle(updatedCheckRun, automation);
    }

    private AutomationCheckRun createCheckRun(Automation automation) {
        log.info("Creating automation check run {}",
                kv("automationId", automation.id()));
        var fingerprint = AutomationFingerprint.of(automation);
        return automationCheckRunPersistencePort.create(automation.id(), automation.memberId(), fingerprint);
    }
}
