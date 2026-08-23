package com.wispnote.analyzer.adapter.note.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.note.enums.NoteEventKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class NoteEventKindConverter {
    public static final BaseEnumConverter<NoteEventKind, String> rabbit = new BaseEnumConverter<>(Map.of(
            NoteEventKind.CREATED, "note.created",
            NoteEventKind.ENRICHED, "note.enriched"
    ));
}
