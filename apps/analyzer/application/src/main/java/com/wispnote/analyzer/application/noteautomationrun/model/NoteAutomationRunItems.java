package com.wispnote.analyzer.application.noteautomationrun.model;

import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record NoteAutomationRunItems(List<NoteAutomationRunItem> values) {
    public NoteAutomationRunItems {
        values = List.copyOf(values);
    }

    public static NoteAutomationRunItems pending(List<RunnableAutomation> automations) {
        return new NoteAutomationRunItems(automations.stream()
                .map(NoteAutomationRunItem::pending)
                .toList());
    }

    public NoteAutomationRunStatus status() {
        if (values.stream().anyMatch(NoteAutomationRunItem::isPending)) {
            return NoteAutomationRunStatus.IN_PROGRESS;
        }
        if (values.stream().anyMatch(NoteAutomationRunItem::isFailed)) {
            return NoteAutomationRunStatus.FAILED;
        }
        return NoteAutomationRunStatus.FINISHED;
    }

    public NoteAutomationRunItems replace(NoteAutomationRunItem replaced, NoteAutomationRunItem replacement) {
        return new NoteAutomationRunItems(values.stream()
                .map(item -> item.equals(replaced) ? replacement : item)
                .toList());
    }

    public Optional<NoteAutomationRunItem> findByAutomationId(UUID automationId) {
        return values.stream()
                .filter(item -> item.automationId().equals(automationId))
                .findFirst();
    }

    public List<NoteAutomationRunItem> waitingForMatch() {
        return values.stream()
                .filter(NoteAutomationRunItem::isWaitingForMatch)
                .toList();
    }

    public List<NoteAutomationRunItem> waitingForAction() {
        return values.stream()
                .filter(NoteAutomationRunItem::isWaitingForAction)
                .toList();
    }
}
