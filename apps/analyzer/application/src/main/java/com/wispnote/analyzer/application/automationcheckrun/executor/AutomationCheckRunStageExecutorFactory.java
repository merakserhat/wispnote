package com.wispnote.analyzer.application.automationcheckrun.executor;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AutomationCheckRunStageExecutorFactory {

    private final Map<AutomationCheckRunStage, AutomationCheckRunStageExecutor> stageExecutors;

    public AutomationCheckRunStageExecutorFactory(Set<AutomationCheckRunStageExecutor> stageExecutorSet) {
        this.stageExecutors = stageExecutorSet
                .stream()
                .collect(Collectors.toMap(AutomationCheckRunStageExecutor::getStage, Function.identity()));
    }

    public AutomationCheckRunStageExecutor getExecutor(AutomationCheckRunStage stage) {
        return stageExecutors.get(stage);
    }
}
