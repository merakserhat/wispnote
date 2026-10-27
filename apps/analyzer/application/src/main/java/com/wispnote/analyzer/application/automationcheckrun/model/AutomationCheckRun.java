package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStatus;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
public record AutomationCheckRun(UUID id,
                                 Long version,
                                 UUID automationId,
                                 UUID memberId,
                                 AutomationFingerprint fingerprint,
                                 Integer confidence,
                                 AutomationCheckRunItems items) {

    public AutomationCheckRunStatus status() {
        return items.status();
    }

    public Optional<AutomationCheckRunItemOutcome> outcome() {
        return items.outcome();
    }

    public boolean isNotCompleted() {
        return status() == AutomationCheckRunStatus.IN_PROGRESS;
    }

    public boolean isCompleted() {
        return !this.isNotCompleted();
    }

    public boolean isIdentical(AutomationFingerprint otherFingerprint) {
        return fingerprint.equals(otherFingerprint);
    }

    public AutomationCheckRunStage currentStage() {
        return items.getCurrentStage();
    }

    public AutomationCheckRun start(AutomationCheckRunStage stage) {
        if (items.findLive(stage).isPresent()) {
            return this;
        }

        return withItems(items.with(AutomationCheckRunItem.pending(stage)));
    }

     public AutomationCheckRun apply(AutomationCheckRunStageExecutionResult executionResult) {
        var pendingItem = items.findLive(executionResult.stage())
                .filter(AutomationCheckRunItem::isPending);

        if (pendingItem.isEmpty()) {
            log.warn("Dropping stage execution result, no pending item {} {}",
                    kv("automationCheckRunId", id),
                    kv("stage", executionResult.stage()));
            return this;
        }

        var item = pendingItem.get();
        return withItems(items.replace(item, item.finish(executionResult)));
    }

    public AutomationCheckRun fail(AutomationCheckRunStage stage, String reason) {
        var pendingItem = items.findLive(stage)
                .filter(AutomationCheckRunItem::isPending);

        if (pendingItem.isEmpty()) {
            log.warn("No pending item to fail {} {}",
                    kv("automationCheckRunId", id),
                    kv("stage", stage));
            return this;
        }

        var item = pendingItem.get();
        return withItems(items.replace(item, item.fail(reason)));
    }

    public Optional<AutomationActionType> getDecidedActionType() {
        return items().findLive(AutomationCheckRunStage.ACTION_DETECTION)
                .filter(AutomationCheckRunItem::isFinished)
                .map(AutomationCheckRunItem::decidedActionType);
    }

    private AutomationCheckRun withItems(AutomationCheckRunItems items) {
        return new AutomationCheckRun(id, version, automationId, memberId, fingerprint, confidence, items);
    }

    public AutomationCheckRun updateFingerprint(AutomationFingerprint fingerprint) {
        return new AutomationCheckRun(id, version, automationId, memberId, fingerprint, confidence, items.invalidated());
    }
}
