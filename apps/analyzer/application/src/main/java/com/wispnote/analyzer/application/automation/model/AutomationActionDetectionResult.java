package com.wispnote.analyzer.application.automation.model;

import com.wispnote.analyzer.application.automation.enums.AutomationActionDetectionVerdict;
import com.wispnote.analyzer.application.automation.enums.AutomationActionType;

public record AutomationActionDetectionResult(AutomationActionDetectionVerdict verdict,
                                              AutomationActionType actionType,
                                              String condition,
                                              Integer confidence,
                                              String details) {
}
