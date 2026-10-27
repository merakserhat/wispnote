package com.wispnote.analyzer.application.automationcheckrun.executor.strategy;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationActionEnrichmentStrategyNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AutomationActionEnrichmentStrategyFactory {

    private final Map<AutomationActionType, AutomationActionEnrichmentStrategy> strategies;

    public AutomationActionEnrichmentStrategyFactory(Set<AutomationActionEnrichmentStrategy> strategySet) {
        this.strategies = strategySet
                .stream()
                .collect(Collectors.toMap(AutomationActionEnrichmentStrategy::getActionType, Function.identity()));
    }

    public AutomationActionEnrichmentStrategy getStrategy(AutomationActionType actionType) {
        return Optional.ofNullable(strategies.get(actionType))
                .orElseThrow(() -> new AutomationActionEnrichmentStrategyNotFoundException(actionType));
    }
}
