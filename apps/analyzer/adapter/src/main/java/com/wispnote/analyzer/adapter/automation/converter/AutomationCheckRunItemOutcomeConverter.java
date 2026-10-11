package com.wispnote.analyzer.adapter.automation.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemOutcome;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class AutomationCheckRunItemOutcomeConverter {

    private static final Map<AutomationCheckRunItemOutcome, String> MAPPINGS = Map.of(
            AutomationCheckRunItemOutcome.PASSED, "PASSED",
            AutomationCheckRunItemOutcome.REJECTED, "REJECTED"
    );

    public static final BaseEnumConverter<AutomationCheckRunItemOutcome, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
