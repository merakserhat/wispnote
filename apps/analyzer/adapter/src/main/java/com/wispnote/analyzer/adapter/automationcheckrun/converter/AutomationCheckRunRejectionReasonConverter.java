package com.wispnote.analyzer.adapter.automationcheckrun.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunRejectionReason;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class AutomationCheckRunRejectionReasonConverter {

    private static final Map<AutomationCheckRunRejectionReason, String> MAPPINGS = Map.of(
            AutomationCheckRunRejectionReason.NO_ACTION, "NO_ACTION",
            AutomationCheckRunRejectionReason.UNSUPPORTED_ACTION, "UNSUPPORTED_ACTION",
            AutomationCheckRunRejectionReason.MISSING_PARAMETER, "MISSING_PARAMETER",
            AutomationCheckRunRejectionReason.LOW_CONFIDENCE, "LOW_CONFIDENCE"
    );

    public static final BaseEnumConverter<AutomationCheckRunRejectionReason, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
