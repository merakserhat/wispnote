package com.wispnote.analyzer.application.automationcheckrun.service;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationCheckRunConflictException;
import com.wispnote.analyzer.application.automationcheckrun.executor.AutomationCheckRunStageExecutorFactory;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationCheckRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationCheckRunHandlerService {

    private final AutomationCheckRunStageExecutorFactory stageExecutorFactory;
    private final AutomationCheckRunPersistencePort automationCheckRunPersistencePort;

    public void handle(AutomationCheckRun checkRun, Automation automation) {
        if (checkRun.isCompleted()) {
            log.info("Automation check run already completed {}", kv("automationCheckRunId", checkRun.id()));
            return;
        }

        var currentCheckRun = checkRun;

        while (currentCheckRun.isNotCompleted()) {
            var stage = currentCheckRun.currentStage();
            log.info("Executing automation check run stage {} {}",
                    kv("automationCheckRunId", currentCheckRun.id()),
                    kv("stage", stage));

            currentCheckRun = automationCheckRunPersistencePort.update(currentCheckRun.start(stage));

            try {
                var executor = stageExecutorFactory.getExecutor(stage);
                var executionResult = executor.execute(currentCheckRun, automation);

                var appliedCheckRun = currentCheckRun.apply(executionResult);
                currentCheckRun = automationCheckRunPersistencePort.update(appliedCheckRun);
            } catch (AutomationCheckRunConflictException exception) {
                throw exception;
            } catch (Exception exception) {
                log.error("Automation check run stage failed {} {}",
                        kv("automationCheckRunId", currentCheckRun.id()),
                        kv("stage", stage),
                        exception);
                var failedCheckRun = currentCheckRun.fail(stage, exception.getMessage());
                currentCheckRun = automationCheckRunPersistencePort.update(failedCheckRun);
            }
        }

        log.info("Automation check run completed {} {} {}",
                kv("automationCheckRunId", currentCheckRun.id()),
                kv("status", currentCheckRun.status()),
                kv("outcome", currentCheckRun.outcome().orElse(null)));
    }
}
