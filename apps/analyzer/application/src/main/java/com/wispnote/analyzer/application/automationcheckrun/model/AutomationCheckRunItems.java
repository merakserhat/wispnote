package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStatus;

import java.util.List;

import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus.FAILED;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus.FINISHED;

public record AutomationCheckRunItems(List<AutomationCheckRunItem> values) {

    public AutomationCheckRunItems {
        values = List.copyOf(values);
    }

    public AutomationCheckRunStatus status() {
        if (values.isEmpty()) {
            return AutomationCheckRunStatus.FINISHED;
        }
        var allDone = values.stream()
                .allMatch(item -> item.status() == FINISHED || item.status() == FAILED);
        return allDone ? AutomationCheckRunStatus.FINISHED : AutomationCheckRunStatus.IN_PROGRESS;
    }
}
