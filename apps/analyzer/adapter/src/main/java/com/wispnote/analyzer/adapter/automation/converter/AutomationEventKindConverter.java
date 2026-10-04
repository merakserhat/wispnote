package com.wispnote.analyzer.adapter.automation.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.automation.enums.AutomationEventKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static com.wispnote.analyzer.adapter.automation.rabbit.config.AutomationRabbitConfiguration.AUTOMATION_CREATED;
import static com.wispnote.analyzer.adapter.automation.rabbit.config.AutomationRabbitConfiguration.AUTOMATION_UPDATED;
import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class AutomationEventKindConverter {
    public static final BaseEnumConverter<AutomationEventKind, String> rabbit = new BaseEnumConverter<>(Map.of(
            AutomationEventKind.CREATED, AUTOMATION_CREATED,
            AutomationEventKind.UPDATED, AUTOMATION_UPDATED
    ));
}
