package com.wispnote.analyzer.adapter.automationcheckrun.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStage;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class AutomationCheckRunStageConverter {

    private static final Map<AutomationCheckRunStage, String> MAPPINGS = Map.of(
            AutomationCheckRunStage.ACTION_DETECTION, "ACTION_DETECTION",
            AutomationCheckRunStage.ACTION_ENRICHMENT, "ACTION_ENRICHMENT"
    );

    public static final BaseEnumConverter<AutomationCheckRunStage, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
