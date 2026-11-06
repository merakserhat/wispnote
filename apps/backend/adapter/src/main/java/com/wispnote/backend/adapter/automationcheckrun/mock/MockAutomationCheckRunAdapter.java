package com.wispnote.backend.adapter.automationcheckrun.mock;

import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.backend.application.automationcheckrun.port.AutomationCheckRunPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "analyzer.provider", havingValue = "mock")
public class MockAutomationCheckRunAdapter implements AutomationCheckRunPort {

    @Override
    public List<AutomationCheckRun> findAllByMemberIdAndAutomationIds(UUID memberId, List<UUID> automationIds) {
        log.info("MOCK - Retrieving automation check runs. {} {}",
                kv("memberId", memberId),
                kv("automationCount", automationIds.size()));
        return List.of();
    }
}
