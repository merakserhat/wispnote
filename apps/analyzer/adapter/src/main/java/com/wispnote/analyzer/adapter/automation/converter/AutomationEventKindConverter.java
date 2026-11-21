package com.wispnote.analyzer.adapter.automation.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automation.enums.AutomationEventKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class AutomationEventKindConverter {
    public static final BaseEnumConverter<AutomationEventKind, String> message = new BaseEnumConverter<>(Map.of(
            AutomationEventKind.CREATED, "automation.created",
            AutomationEventKind.UPDATED, "automation.updated"
    ));
}
