package com.wispnote.analyzer.adapter.automation.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunItemStatus;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class AutomationCheckRunItemStatusConverter {

    private static final Map<AutomationCheckRunItemStatus, String> MAPPINGS = Map.of(
            AutomationCheckRunItemStatus.PENDING, "PENDING",
            AutomationCheckRunItemStatus.FINISHED, "FINISHED",
            AutomationCheckRunItemStatus.FAILED, "FAILED",
            AutomationCheckRunItemStatus.INVALIDATED, "INVALIDATED"
    );

    public static final BaseEnumConverter<AutomationCheckRunItemStatus, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
