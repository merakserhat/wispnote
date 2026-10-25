package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunRejectionReason;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome.PASSED;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemOutcome.REJECTED;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus.FAILED;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus.FINISHED;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus.INVALIDATED;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunItemStatus.PENDING;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunRejectionReason.LOW_CONFIDENCE;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunRejectionReason.MISSING_PARAMETER;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunRejectionReason.NO_ACTION;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunRejectionReason.UNSUPPORTED_ACTION;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage.ACTION_DETECTION;
import static com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage.ACTION_ENRICHMENT;
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

    public AutomationCheckRunItem withStatus(AutomationCheckRunItemStatus status) {
        return new AutomationCheckRunItem(id, stage, status, outcome, rejectionReason, details, confidence, decidedActionType, condition, requiredGroupTitle);
    }
}
