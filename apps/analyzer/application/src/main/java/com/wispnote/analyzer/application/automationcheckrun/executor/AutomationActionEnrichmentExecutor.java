package com.wispnote.analyzer.application.automationcheckrun.executor;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationActionNotDecidedException;
import com.wispnote.analyzer.application.automationcheckrun.executor.strategy.AutomationActionEnrichmentStrategyFactory;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunStageExecutionResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public final class AutomationActionEnrichmentExecutor implements AutomationCheckRunStageExecutor {

    private final AutomationActionEnrichmentStrategyFactory strategyFactory;

    @Override
    public AutomationCheckRunStageExecutionResult execute(AutomationCheckRun automationCheckRun, Automation automation) {
        var actionType = automationCheckRun.getDecidedActionType()
                .orElseThrow(AutomationActionNotDecidedException::new);
        var strategy = strategyFactory.getStrategy(actionType);

        var result = strategy.enrich(automationCheckRun, automation);

        log.info("Automation action enriched {} {} {} {}",
                kv("automationCheckRunId", automationCheckRun.id()),
                kv("actionType", actionType),
                kv("outcome", result.outcome()),
                kv("confidence", result.confidence()));

        return result;
    }

    @Override
    public AutomationCheckRunStage getStage() {
        return AutomationCheckRunStage.ACTION_ENRICHMENT;
    }
}
