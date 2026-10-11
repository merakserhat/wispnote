package com.wispnote.analyzer.application.automationcheckrun.enums;

/**
 * Declaration order is pipeline order: a stage only runs once every earlier stage has passed.
 */
public enum AutomationCheckRunStage {
    ACTION_DETECTION,
    ACTION_ENRICHMENT
}
