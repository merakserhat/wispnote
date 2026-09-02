package com.wispnote.backend.application.note.model;

import com.wispnote.backend.application.note.enums.SourceKind;

import java.util.Map;

public record SourceCapture(SourceKind kind,
                            String title,
                            String url,
                            String filePath,
                            String appName,
                            String bundleId,
                            String documentId,
                            Map<String, Object> metadata) {
}
