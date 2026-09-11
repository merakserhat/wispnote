package com.wispnote.backend.application.source.model;

import java.time.Instant;

public record SourceSummary(Source source,
                            Long noteCount,
                            Instant lastActivityAt) {
}
