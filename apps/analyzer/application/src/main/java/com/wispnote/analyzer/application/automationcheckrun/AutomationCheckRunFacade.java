package com.wispnote.analyzer.application.automationcheckrun;

import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationCheckRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationCheckRunFacade {

    private final AutomationCheckRunPersistencePort automationCheckRunPersistencePort;

    public List<AutomationCheckRun> listByAutomationIds(UUID memberId, List<UUID> automationIds) {
        log.info("Listing automation check runs {} {}",
                kv("memberId", memberId),
                kv("automationCount", automationIds.size()));

        return automationCheckRunPersistencePort.findAllByMemberIdAndAutomationIds(memberId, automationIds);
    }
}
