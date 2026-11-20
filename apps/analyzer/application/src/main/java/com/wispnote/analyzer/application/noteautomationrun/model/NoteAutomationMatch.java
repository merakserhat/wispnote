package com.wispnote.analyzer.application.noteautomationrun.model;

import org.apache.commons.lang3.StringUtils;

import java.util.UUID;

public record NoteAutomationMatch(UUID automationId,
                                  boolean matched,
                                  Integer confidence,
                                  String details) {
    public static final int MIN_CONFIDENCE = 0;
    public static final int MAX_CONFIDENCE = 100;
    static final int MAX_DETAILS_LENGTH = 500;

    public NoteAutomationMatch {
        if (confidence != null && (confidence < MIN_CONFIDENCE || confidence > MAX_CONFIDENCE)) {
            throw new IllegalArgumentException("Confidence must be between 0 and 100");
        }
        details = StringUtils.isBlank(details) ? null : StringUtils.abbreviate(details.strip(), MAX_DETAILS_LENGTH);
    }

    public static NoteAutomationMatch notMatched(UUID automationId) {
        return new NoteAutomationMatch(automationId, false, null, null);
    }
}
