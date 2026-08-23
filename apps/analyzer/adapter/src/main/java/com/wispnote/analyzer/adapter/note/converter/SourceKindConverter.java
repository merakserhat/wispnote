package com.wispnote.analyzer.adapter.note.converter;

import com.wispnote.analyzer.adapter.common.converter.BaseEnumConverter;
import com.wispnote.analyzer.application.note.enums.SourceKind;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class SourceKindConverter {
    public static final BaseEnumConverter<SourceKind, String> rabbit = new BaseEnumConverter<>(Map.of(
            SourceKind.WEB, "web",
            SourceKind.PDF, "pdf",
            SourceKind.FILE, "file",
            SourceKind.MAIL, "mail",
            SourceKind.APP, "app"
    ));
}
