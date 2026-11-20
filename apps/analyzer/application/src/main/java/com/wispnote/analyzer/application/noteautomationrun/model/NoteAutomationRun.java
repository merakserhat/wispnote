package com.wispnote.analyzer.application.noteautomationrun.model;

import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunStatus;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
public record NoteAutomationRun(UUID id,
                                Long version,
                                UUID noteId,
                                UUID memberId,
                                Instant updatedAt,
                                NoteAutomationRunItems items) {

    public NoteAutomationRunStatus status() {
        return items.status();
    }

    public boolean isNotCompleted() {
        return status() == NoteAutomationRunStatus.IN_PROGRESS;
    }

    public boolean isCompleted() {
        return !this.isNotCompleted();
    }

    public List<NoteAutomationRunItem> itemsWaitingForMatch() {
        return items.waitingForMatch();
    }

    public List<NoteAutomationRunItem> itemsWaitingForAction() {
        return items.waitingForAction();
    }

    public NoteAutomationRun applyMatches(NoteAutomationMatchResult matchResult) {
        var updatedItems = items;
        for (var item : items.waitingForMatch()) {
            var match = matchResult.findByAutomationId(item.automationId())
                    .orElseGet(() -> NoteAutomationMatch.notMatched(item.automationId()));
            updatedItems = updatedItems.replace(item, item.applyMatch(match));
        }
        return withItems(updatedItems);
    }

    public NoteAutomationRun failMatching(String reason) {
        var updatedItems = items;
        for (var item : items.waitingForMatch()) {
            updatedItems = updatedItems.replace(item, item.fail(reason));
        }
        return withItems(updatedItems);
    }

    public NoteAutomationRun apply(NoteAutomationActionExecutionResult executionResult) {
        var waitingItem = items.findByAutomationId(executionResult.automationId())
                .filter(NoteAutomationRunItem::isWaitingForAction);
        if (waitingItem.isEmpty()) {
            log.warn("Dropping action execution result, no item waiting for action {} {}",
                    kv("noteAutomationRunId", id),
                    kv("automationId", executionResult.automationId()));
            return this;
        }
        var item = waitingItem.get();
        return withItems(items.replace(item, item.finish(executionResult)));
    }

    public NoteAutomationRun fail(UUID automationId, String reason) {
        var pendingItem = items.findByAutomationId(automationId)
                .filter(NoteAutomationRunItem::isPending);
        if (pendingItem.isEmpty()) {
            log.warn("No pending item to fail {} {}",
                    kv("noteAutomationRunId", id),
                    kv("automationId", automationId));
            return this;
        }
        var item = pendingItem.get();
        return withItems(items.replace(item, item.fail(reason)));
    }

    private NoteAutomationRun withItems(NoteAutomationRunItems items) {
        return new NoteAutomationRun(id, version, noteId, memberId, updatedAt, items);
    }
}
