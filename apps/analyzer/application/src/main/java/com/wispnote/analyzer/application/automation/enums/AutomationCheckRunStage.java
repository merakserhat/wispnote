package com.wispnote.analyzer.application.automation.enums;

/**
 * Declaration order is pipeline order: a stage only runs once every earlier stage has passed.
 */
public enum AutomationCheckRunStage {
    ACTION_DETECTION,
    ACTION_ENRICHMENT
}
