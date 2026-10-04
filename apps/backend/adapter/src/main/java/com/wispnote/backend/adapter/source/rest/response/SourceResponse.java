package com.wispnote.backend.adapter.source.rest.response;

import com.wispnote.backend.application.source.enums.SourceKind;
import com.wispnote.backend.application.source.model.SourceSummary;

import java.time.Instant;
import java.util.UUID;

public record SourceResponse(UUID id,
                             SourceKind kind,
                             String title,
                             String url,
                             String filePath,
                             String appName,
                             String bundleId,
                             String externalId,
                             Integer pageCount,
                             Long noteCount,
                             Instant lastActivityAt) {

    public static SourceResponse from(SourceSummary summary) {
        var source = summary.source();

        return new SourceResponse(source.id(),
                source.kind(),
                source.title(),
                source.url(),
                source.filePath(),
                source.appName(),
                source.bundleId(),
                source.externalId(),
                source.pageCount(),
                summary.noteCount(),
                summary.lastActivityAt());
    }
}
