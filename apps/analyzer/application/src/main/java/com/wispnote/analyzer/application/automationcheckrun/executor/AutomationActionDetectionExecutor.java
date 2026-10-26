package com.wispnote.analyzer.application.automationcheckrun.executor;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionExecutionResult;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionResult;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItem;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunStageExecutionResult;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationActionDetectionPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public final class AutomationActionDetectionExecutor implements AutomationCheckRunStageExecutor {

    private final AutomationActionDetectionPort automationActionDetectionPort;

    @Override
    public AutomationCheckRunStageExecutionResult execute(AutomationCheckRun automationCheckRun, Automation automation) {
        var request = AutomationActionDetectionRequest.of(automation.ruleText());
        var result = automationActionDetectionPort.detect(request);

        log.info("Automation action detected {} {} {} {}",
                kv("automationCheckRunId", automationCheckRun.id()),
                kv("verdict", result.verdict()),
                kv("actionType", result.actionType()),
                kv("confidence", result.confidence()));

        return switch (result.verdict()) {
            case NONE, UNSUPPORTED -> rejected(result);
            case DETECTED -> result.confidence() < AutomationCheckRunItem.MIN_CONFIDENCE ? rejected(result) : passed(result);
        };
    }

    @Override
    public AutomationCheckRunStage getStage() {
        return AutomationCheckRunStage.ACTION_DETECTION;
    }

    private static AutomationActionDetectionExecutionResult passed(AutomationActionDetectionResult result) {
        return new AutomationActionDetectionExecutionResult(
                AutomationCheckRunItemOutcome.PASSED, result.confidence(), result.details(), result.actionType());
    }

    private static AutomationActionDetectionExecutionResult rejected(AutomationActionDetectionResult result) {
        return new AutomationActionDetectionExecutionResult(
                AutomationCheckRunItemOutcome.REJECTED, result.confidence(), result.details(), null);
    }
}
