package com.wispnote.backend.adapter.automationcheckrun.analyzer;

import com.wispnote.backend.adapter.analyzer.AnalyzerRestClient;
import com.wispnote.backend.adapter.analyzer.response.AnalyzerAutomationCheckRunResponse;
import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.backend.application.automationcheckrun.port.AutomationCheckRunPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "analyzer.provider", havingValue = "rest", matchIfMissing = true)
public class AutomationCheckRunAnalyzerAdapter implements AutomationCheckRunPort {

    private final AnalyzerRestClient analyzerRestClient;

    @Override
    public List<AutomationCheckRun> findAllByMemberIdAndAutomationIds(UUID memberId, List<UUID> automationIds) {
        log.info("Retrieving automation check runs from analyzer {} {}",
                kv("memberId", memberId),
                kv("automationCount", automationIds.size()));

        if (automationIds.isEmpty()) {
            return List.of();
        }

        return analyzerRestClient.listAutomationCheckRuns(memberId, automationIds).result().stream()
                .map(AnalyzerAutomationCheckRunResponse::toModel)
                .toList();
    }
}
