package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionDetectionVerdict;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import org.apache.commons.lang3.StringUtils;

public record AutomationActionDetectionResult(AutomationActionDetectionVerdict verdict,
                                              AutomationActionType actionType,
                                              Integer confidence,
                                              String details) {

    public static final int MIN_CONFIDENCE = 0;
    public static final int MAX_CONFIDENCE = 100;
    static final int MAX_DETAILS_LENGTH = 500;

    public AutomationActionDetectionResult {
        if (verdict == null) {
            throw new IllegalArgumentException("Verdict is required");
        }
        if (verdict == AutomationActionDetectionVerdict.DETECTED && actionType == null) {
            throw new IllegalArgumentException("Action type is required when an action is detected");
        }
        if (verdict != AutomationActionDetectionVerdict.DETECTED && actionType != null) {
            throw new IllegalArgumentException("Action type must be null unless an action is detected");
        }
        if (confidence == null || confidence < MIN_CONFIDENCE || confidence > MAX_CONFIDENCE) {
            throw new IllegalArgumentException("Confidence must be between 0 and 100");
        }
        details = StringUtils.isBlank(details) ? null : StringUtils.abbreviate(details.strip(), MAX_DETAILS_LENGTH);
    }

    public static AutomationActionDetectionResult detected(AutomationActionType actionType, int confidence, String details) {
        return new AutomationActionDetectionResult(AutomationActionDetectionVerdict.DETECTED, actionType, confidence, details);
    }

    public static AutomationActionDetectionResult unsupported(int confidence, String details) {
        return new AutomationActionDetectionResult(AutomationActionDetectionVerdict.UNSUPPORTED, null, confidence, details);
    }

    public static AutomationActionDetectionResult none(int confidence, String details) {
        return new AutomationActionDetectionResult(AutomationActionDetectionVerdict.NONE, null, confidence, details);
    }
}
