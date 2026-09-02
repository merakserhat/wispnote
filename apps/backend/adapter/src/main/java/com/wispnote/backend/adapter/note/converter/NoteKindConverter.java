package com.wispnote.backend.adapter.note.converter;

import com.wispnote.backend.adapter.common.converter.BaseEnumConverter;
import com.wispnote.backend.application.note.enums.NoteKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class NoteKindConverter {
    public static final BaseEnumConverter<NoteKind, String> jpa = new BaseEnumConverter<>(Map.of(
            NoteKind.HIGHLIGHT, "highlight",
            NoteKind.NOTE, "note",
            NoteKind.IMPORTED, "imported"
    ));
}
