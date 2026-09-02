package com.wispnote.backend.adapter.note.converter;

import com.wispnote.backend.adapter.common.converter.BaseEnumConverter;
import com.wispnote.backend.application.note.enums.SourceKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class SourceKindConverter {
    public static final BaseEnumConverter<SourceKind, String> jpa = new BaseEnumConverter<>(Map.of(
            SourceKind.WEB, "web",
            SourceKind.PDF, "pdf",
            SourceKind.FILE, "file",
            SourceKind.MAIL, "mail",
            SourceKind.APP, "app"
    ));
}
