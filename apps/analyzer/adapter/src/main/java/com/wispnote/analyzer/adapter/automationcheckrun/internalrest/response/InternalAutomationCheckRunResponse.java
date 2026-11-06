package com.wispnote.analyzer.adapter.automationcheckrun.internalrest.response;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStatus;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItem;

import java.util.UUID;

public record InternalAutomationCheckRunResponse(UUID automationId,
                                                 AutomationCheckRunStatus status,
                                                 AutomationCheckRunItemOutcome outcome,
                                                 AutomationActionType actionType,
                                                 String condition,
                                                 UUID requiredGroupId,
                                                 String requiredGroupTitle,
                                                 Integer confidence,
                                                 String details) {

    public static InternalAutomationCheckRunResponse from(AutomationCheckRun checkRun) {
        var enrichment = checkRun.findLiveItem(AutomationCheckRunStage.ACTION_ENRICHMENT)
                .filter(AutomationCheckRunItem::isFinished);
        var outcomeItem = checkRun.findOutcomeItem();

        return new InternalAutomationCheckRunResponse(
                checkRun.automationId(),
                checkRun.status(),
                checkRun.outcome().orElse(null),
                checkRun.getDecidedActionType().orElse(null),
                enrichment.map(AutomationCheckRunItem::condition).orElse(null),
                enrichment.map(AutomationCheckRunItem::requiredGroupId).orElse(null),
                enrichment.map(AutomationCheckRunItem::requiredGroupTitle).orElse(null),
                outcomeItem.map(item -> item.result().confidence()).orElse(null),
                outcomeItem.map(item -> item.result().details()).orElse(null));
    }
}
