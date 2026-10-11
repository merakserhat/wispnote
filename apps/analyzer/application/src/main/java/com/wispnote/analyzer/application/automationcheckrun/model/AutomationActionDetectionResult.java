package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionDetectionVerdict;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;

public record AutomationActionDetectionResult(AutomationActionDetectionVerdict verdict,
                                              AutomationActionType actionType,
                                              String condition,
                                              Integer confidence,
                                              String details) {
}
