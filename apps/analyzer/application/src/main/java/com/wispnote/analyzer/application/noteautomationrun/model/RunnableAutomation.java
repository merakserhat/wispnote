package com.wispnote.analyzer.application.noteautomationrun.model;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStatus;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationFingerprint;

import java.util.Optional;
import java.util.UUID;

public record RunnableAutomation(UUID automationId,
                                 AutomationActionType actionType,
                                 String condition,
                                 UUID requiredGroupId,
                                 String requiredGroupTitle) {

    public static Optional<RunnableAutomation> of(Automation automation, AutomationCheckRun automationCheckRun) {
        if (!Boolean.TRUE.equals(automation.enabled())) {
            return Optional.empty();
        }
        if (!automationCheckRun.isIdentical(AutomationFingerprint.of(automation))) {
            return Optional.empty();
        }
        if (automationCheckRun.status() != AutomationCheckRunStatus.FINISHED) {
            return Optional.empty();
        }
        return automationCheckRun.outcome()
                .filter(outcome -> outcome == AutomationCheckRunItemOutcome.PASSED)
                .flatMap(outcome -> automationCheckRun.findLiveItem(AutomationCheckRunStage.ACTION_ENRICHMENT))
                .map(enrichment -> new RunnableAutomation(
                        automation.id(),
                        automationCheckRun.getDecidedActionType().orElseThrow(),
                        enrichment.condition(),
                        enrichment.requiredGroupId(),
                        enrichment.requiredGroupTitle()));
    }
}
