package com.wispnote.analyzer.adapter.noteautomationrun.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.noteautomationrun.enums.NoteAutomationRunItemOutcome;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public final class NoteAutomationRunItemOutcomeConverter {
    private static final Map<NoteAutomationRunItemOutcome, String> MAPPINGS = Map.of(
            NoteAutomationRunItemOutcome.APPLIED, "APPLIED",
            NoteAutomationRunItemOutcome.NOT_MATCHED, "NOT_MATCHED",
            NoteAutomationRunItemOutcome.SKIPPED, "SKIPPED"
    );

    public static final BaseEnumConverter<NoteAutomationRunItemOutcome, String> entity = new BaseEnumConverter<>(MAPPINGS);
}
