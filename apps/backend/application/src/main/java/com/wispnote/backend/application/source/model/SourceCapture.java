package com.wispnote.backend.application.source.model;

import com.wispnote.backend.application.source.enums.SourceKind;

import java.util.Map;

public record SourceCapture(SourceKind kind,
                            String title,
                            String url,
                            String filePath,
                            String appName,
                            String bundleId,
                            String documentId,
                            Integer pageCount,
                            Map<String, Object> metadata) {
}
