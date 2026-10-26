package com.wispnote.analyzer.adapter.actiondetection.openai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionResult;

@JsonClassDescription("Result of reading an automation rule written by a member and deciding which action it asks for.")
public class AutomationActionDetectionOutput {

    @JsonPropertyDescription("ADD_NOTE_TO_GROUP when the rule asks to put matching notes into a note group; "
            + "UNSUPPORTED when the rule clearly asks for an action but it is not one of the supported actions; "
            + "NONE when the rule asks for no action at all, is empty, or is not an automation rule.")
    public Action action;

    @JsonPropertyDescription("How sure you are about the action, from 0 to 100. Below 50 means you are guessing.")
    public int confidence;

    @JsonPropertyDescription("At most 30 words in plain English for the member who wrote the rule. When an action is "
            + "detected, restate what the automation will do. When UNSUPPORTED, say what was asked for and that it is "
            + "not supported. When NONE, say what is missing. No field names or technical terms.")
    public String details;

    public enum Action {
        ADD_NOTE_TO_GROUP,
        UNSUPPORTED,
        NONE
    }

    public AutomationActionDetectionResult toModel() {
        if (action == null) {
            throw new IllegalStateException("Action detection output has no action");
        }
        return switch (action) {
            case ADD_NOTE_TO_GROUP -> AutomationActionDetectionResult.detected(AutomationActionType.ADD_NOTE_TO_GROUP, confidence, details);
            case UNSUPPORTED -> AutomationActionDetectionResult.unsupported(confidence, details);
            case NONE -> AutomationActionDetectionResult.none(confidence, details);
        };
    }
}
