package com.wispnote.analyzer.application.automationcheckrun.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Declaration order is pipeline order: a stage only runs once every earlier stage has passed.
 */
@Getter
@RequiredArgsConstructor
public enum AutomationCheckRunStage {
    ACTION_DETECTION(0),
    ACTION_ENRICHMENT(1);

    private final Integer order;

    public static AutomationCheckRunStage firstStage() {
        return ACTION_DETECTION;
    }
}
