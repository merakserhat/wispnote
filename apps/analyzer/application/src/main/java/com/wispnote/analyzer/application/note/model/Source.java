package com.wispnote.analyzer.application.note.model;

import com.wispnote.analyzer.application.note.enums.SourceKind;

public record Source(Long id,
                     SourceKind kind,
                     String key,
                     String title,
                     String url,
                     String filePath) {
}
