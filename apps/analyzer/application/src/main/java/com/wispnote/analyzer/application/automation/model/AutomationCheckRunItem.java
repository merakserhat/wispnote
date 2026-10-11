package com.wispnote.analyzer.application.automation.model;

import com.wispnote.analyzer.application.automation.enums.AutomationActionType;
import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemStatus;
import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunRejectionReason;
import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunStage;

import java.util.UUID;

import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemOutcome.PASSED;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemOutcome.REJECTED;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemStatus.FAILED;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemStatus.FINISHED;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemStatus.INVALIDATED;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemStatus.PENDING;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunRejectionReason.LOW_CONFIDENCE;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunRejectionReason.MISSING_PARAMETER;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunRejectionReason.NO_ACTION;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunRejectionReason.UNSUPPORTED_ACTION;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunStage.ACTION_DETECTION;
import static com.wispnote.analyzer.application.automation.enums.AutomationCheckRunStage.ACTION_ENRICHMENT;
public record AutomationCheckRunItem(UUID id,
                                     AutomationCheckRunStage stage,
                                     AutomationCheckRunItemStatus status,
                                     AutomationCheckRunItemOutcome outcome,
                                     AutomationCheckRunRejectionReason rejectionReason,
                                     String details,
                                     Integer confidence,
                                     AutomationActionType decidedActionType,
                                     String condition,
                                     String requiredGroupTitle) {
}
