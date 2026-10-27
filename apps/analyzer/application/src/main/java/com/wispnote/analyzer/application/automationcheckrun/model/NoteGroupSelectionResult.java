package com.wispnote.analyzer.application.automationcheckrun.model;

import org.apache.commons.lang3.StringUtils;

public record NoteGroupSelectionResult(String condition,
                                       String groupTitle,
                                       Integer confidence,
                                       String details) {

    public static final int MIN_CONFIDENCE = 0;
    public static final int MAX_CONFIDENCE = 100;
    static final int MAX_DETAILS_LENGTH = 500;

    public NoteGroupSelectionResult {
        if (confidence == null || confidence < MIN_CONFIDENCE || confidence > MAX_CONFIDENCE) {
            throw new IllegalArgumentException("Confidence must be between 0 and 100");
        }
        condition = StringUtils.isBlank(condition) ? null : condition.strip();
        groupTitle = StringUtils.isBlank(groupTitle) ? null : groupTitle.strip();
        details = StringUtils.isBlank(details) ? null : StringUtils.abbreviate(details.strip(), MAX_DETAILS_LENGTH);
    }

    public boolean isComplete() {
        return condition != null && groupTitle != null;
    }
}
