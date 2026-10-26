package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStatus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public record AutomationCheckRunItems(List<AutomationCheckRunItem> values) {

    public AutomationCheckRunItems {
        values = List.copyOf(values);
    }

    public AutomationCheckRunItems invalidated() {
        return new AutomationCheckRunItems(values.stream().map(item -> item.withStatus(AutomationCheckRunItemStatus.INVALIDATED)).toList());
    }

    public AutomationCheckRunStatus status() {
        var validItems = getValidItems();

        if (validItems.stream().anyMatch(AutomationCheckRunItem::isFailed)) {
            return AutomationCheckRunStatus.FAILED;
        }

        if (validItems.stream().anyMatch(AutomationCheckRunItem::isRejected)) {
            return AutomationCheckRunStatus.FINISHED;
        }

        if (allStagesFinished(validItems)) {
            return AutomationCheckRunStatus.FINISHED;
        }

        return AutomationCheckRunStatus.IN_PROGRESS;
    }

    public Optional<AutomationCheckRunItemOutcome> outcome() {
        var validItems = getValidItems();

        if (validItems.stream().anyMatch(AutomationCheckRunItem::isRejected)) {
            return Optional.of(AutomationCheckRunItemOutcome.REJECTED);
        }

        return allStagesFinished(validItems) ? Optional.of(AutomationCheckRunItemOutcome.PASSED) : Optional.empty();
    }

    public AutomationCheckRunItems with(AutomationCheckRunItem item) {
        var extended = new ArrayList<>(values);
        extended.add(item);
        return new AutomationCheckRunItems(extended);
    }

    public AutomationCheckRunItems replace(AutomationCheckRunItem replaced, AutomationCheckRunItem replacement) {
        return new AutomationCheckRunItems(values.stream()
                .map(item -> item.equals(replaced) ? replacement : item)
                .toList());
    }

    public Optional<AutomationCheckRunItem> findLive(AutomationCheckRunStage stage) {
        return values.stream()
                .filter(item -> !item.isInvalidated())
                .filter(item -> item.stage() == stage)
                .findFirst();
    }

    public AutomationCheckRunStage getCurrentStage() {
        var validItems = getValidItems();
        var finishedStages = finishedStages(validItems);

        return Arrays.stream(AutomationCheckRunStage.values())
                .filter(stage -> !finishedStages.contains(stage))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("All automation check run stages are finished"));
    }

    private List<AutomationCheckRunItem> getValidItems() {
        return values.stream()
                .filter(item -> !item.isInvalidated())
                .toList();
    }

    private Set<AutomationCheckRunStage> finishedStages(List<AutomationCheckRunItem> liveItems) {
        return liveItems.stream()
                .filter(AutomationCheckRunItem::isFinished)
                .map(AutomationCheckRunItem::stage)
                .collect(Collectors.toSet());
    }

    private boolean allStagesFinished(List<AutomationCheckRunItem> liveItems) {
        return finishedStages(liveItems).containsAll(EnumSet.allOf(AutomationCheckRunStage.class));
    }
}
