package com.wispnote.backend.adapter.source.jpa.projection;

import com.wispnote.backend.adapter.source.jpa.entity.SourceEntity;
import com.wispnote.backend.application.source.model.SourceSummary;

import java.time.Instant;

public interface SourceSummaryProjection {
    SourceEntity getSource();

    Long getNoteCount();

    Instant getLastActivityAt();

    default SourceSummary toModel() {
        return new SourceSummary(getSource().toModel(), getNoteCount().intValue(), getLastActivityAt());
    }
}
