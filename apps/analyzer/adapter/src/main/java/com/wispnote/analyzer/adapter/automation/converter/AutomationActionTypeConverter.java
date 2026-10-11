package com.wispnote.analyzer.adapter.automation.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automation.enums.AutomationActionType;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class AutomationActionTypeConverter {

    private static final Map<AutomationActionType, String> MAPPINGS = Map.of(
            AutomationActionType.ADD_NOTE_TO_GROUP, "ADD_NOTE_TO_GROUP"
    );

    public static final BaseEnumConverter<AutomationActionType, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
