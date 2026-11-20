package com.wispnote.analyzer.adapter.noteautomationrun.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunItemStatus;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class NoteAutomationRunItemStatusConverter {
    private static final Map<NoteAutomationRunItemStatus, String> MAPPINGS = Map.of(
            NoteAutomationRunItemStatus.PENDING, "PENDING",
            NoteAutomationRunItemStatus.FINISHED, "FINISHED",
            NoteAutomationRunItemStatus.FAILED, "FAILED"
    );

    public static final BaseEnumConverter<NoteAutomationRunItemStatus, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
