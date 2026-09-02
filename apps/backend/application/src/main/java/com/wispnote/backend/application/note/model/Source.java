package com.wispnote.backend.application.note.model;

import com.wispnote.backend.application.note.enums.SourceKind;

import java.util.Map;
import java.util.UUID;

public record Source(UUID id,
                     UUID memberId,
                     SourceKind kind,
                     String key,
                     String title,
                     String url,
                     String filePath,
                     String appName,
                     String bundleId,
                     Map<String, Object> metadata) {
}
