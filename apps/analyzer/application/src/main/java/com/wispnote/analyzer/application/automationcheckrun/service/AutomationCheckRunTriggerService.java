package com.wispnote.analyzer.application.automationcheckrun.service;

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

        var checkRun = automationCheckRunPersistencePort.findByAutomationId(event.automationId())
                .orElseGet(() -> createCheckRun(automation));
        var automationFingerprint = AutomationFingerprint.of(automation);

        if (!checkRun.isIdentical(automationFingerprint)) {
            checkRun = automationCheckRunPersistencePort.update(checkRun.updateFingerprint(automationFingerprint));
        } else if (checkRun.isCompleted()) {
            log.info("Automation fingerprints are the same and check run is completed, skipping {}",
                    kv("automationCheckRunId", checkRun.id()));
            return;
        }

        automationCheckRunHandlerService.handle(checkRun, automation);
    }

    private AutomationCheckRun createCheckRun(Automation automation) {
        log.info("Creating automation check run {}",
                kv("automationId", automation.id()));
        var fingerprint = AutomationFingerprint.of(automation);
        return automationCheckRunPersistencePort.create(automation.id(), automation.memberId(), fingerprint);
    }
}
