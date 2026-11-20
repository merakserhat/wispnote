package com.wispnote.backend.application.source.port;

import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.source.model.Source;
import com.wispnote.backend.application.source.model.SourceCapture;
import com.wispnote.backend.application.source.model.SourceFilter;
import com.wispnote.backend.application.source.model.SourceSummary;

import java.util.Optional;
import java.util.UUID;

public interface SourcePort {
    Optional<Source> findByIdAndMemberId(UUID id, UUID memberId);

    Source upsertByMemberIdAndKey(UUID memberId, String key, SourceCapture capture);

    Paginated<SourceSummary> findAllByMemberId(UUID memberId, SourceFilter filter, PaginationInfo paginationInfo);
}
