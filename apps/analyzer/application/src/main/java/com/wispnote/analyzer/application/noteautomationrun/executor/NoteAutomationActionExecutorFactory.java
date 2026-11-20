package com.wispnote.analyzer.application.noteautomationrun.executor;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.noteautomationrun.exception.NoteAutomationActionExecutorNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class NoteAutomationActionExecutorFactory {
    private final Map<AutomationActionType, NoteAutomationActionExecutor> executors;

    public NoteAutomationActionExecutorFactory(Set<NoteAutomationActionExecutor> executorSet) {
        this.executors = executorSet
                .stream()
                .collect(Collectors.toMap(NoteAutomationActionExecutor::getActionType, Function.identity()));
    }

    public NoteAutomationActionExecutor getExecutor(AutomationActionType actionType) {
        return Optional.ofNullable(executors.get(actionType))
                .orElseThrow(() -> new NoteAutomationActionExecutorNotFoundException(actionType));
    }
}
