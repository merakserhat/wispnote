package com.wispnote.analyzer.adapter.note.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.note.enums.NoteKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class NoteKindConverter {
    public static final BaseEnumConverter<NoteKind, String> rabbit = new BaseEnumConverter<>(Map.of(
            NoteKind.HIGHLIGHT, "highlight",
            NoteKind.NOTE, "note",
            NoteKind.IMPORTED, "imported"
    ));
}
