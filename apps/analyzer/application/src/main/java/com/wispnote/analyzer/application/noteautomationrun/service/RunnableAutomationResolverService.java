package com.wispnote.analyzer.application.noteautomationrun.service;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automation.port.AutomationPort;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationCheckRunPersistencePort;
import com.wispnote.analyzer.application.noteautomationrun.model.RunnableAutomation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class RunnableAutomationResolverService {
    private final AutomationPort automationPort;
    private final AutomationCheckRunPersistencePort automationCheckRunPersistencePort;

    public List<RunnableAutomation> resolve(UUID memberId) {
        var automations = automationPort.findAllEnabledByMemberId(memberId);
        var automationIds = automations.stream().map(Automation::id).toList();
        var checkRunsByAutomationId = automationCheckRunPersistencePort
                .findAllByMemberIdAndAutomationIds(memberId, automationIds)
                .stream()
                .collect(Collectors.toMap(AutomationCheckRun::automationId, Function.identity()));
        var runnableAutomations = automations.stream()
                .map(automation -> Optional.ofNullable(checkRunsByAutomationId.get(automation.id()))
                        .flatMap(checkRun -> RunnableAutomation.of(automation, checkRun)))
                .flatMap(Optional::stream)
                .toList();
        log.info("Runnable automations resolved {} {} {}",
                kv("memberId", memberId),
                kv("enabledCount", automations.size()),
                kv("runnableCount", runnableAutomations.size()));
        return runnableAutomations;
    }
}
