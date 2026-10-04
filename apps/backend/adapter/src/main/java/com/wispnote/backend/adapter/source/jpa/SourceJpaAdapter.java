package com.wispnote.backend.adapter.source.jpa;

import com.wispnote.backend.adapter.common.util.PaginationUtil;
import com.wispnote.backend.adapter.source.converter.SourceKindConverter;
import com.wispnote.backend.adapter.source.jpa.entity.SourceEntity;
import com.wispnote.backend.adapter.source.jpa.projection.SourceSummaryProjection;
import com.wispnote.backend.adapter.source.jpa.repository.SourceRepository;
import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.source.model.Source;
import com.wispnote.backend.application.source.model.SourceCapture;
import com.wispnote.backend.application.source.model.SourceFilter;
import com.wispnote.backend.application.source.model.SourceSummary;
import com.wispnote.backend.application.source.port.SourcePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SourceJpaAdapter implements SourcePort {

    private final SourceRepository sourceRepository;

    @Override
    public Source upsertByMemberIdAndKey(UUID memberId, String key, SourceCapture capture) {
        var entity = sourceRepository.findByMemberIdAndKeyAndDeletedFalse(memberId, key)
                .orElseGet(SourceEntity::new);

        entity.setMemberId(memberId);
        entity.setKey(key);
        entity.setKind(SourceKindConverter.jpa.fromEnum(capture.kind()));
        entity.setTitle(capture.title() == null ? "" : capture.title());
        entity.setUrl(capture.url());
        entity.setFilePath(capture.filePath());
        entity.setAppName(capture.appName());
        entity.setBundleId(capture.bundleId());
        entity.setExternalId(capture.documentId());
        entity.setMetadata(capture.metadata() == null ? new HashMap<>() : capture.metadata());
        entity.setPageCount(capture.pageCount());

        return sourceRepository.save(entity).toModel();
    }

    @Override
    public Paginated<SourceSummary> findAllByMemberId(UUID memberId, SourceFilter filter, PaginationInfo paginationInfo) {
        var page = sourceRepository.findAllSummaries(memberId,
                SourceKindConverter.jpa.fromEnum(filter.kind()),
                PaginationUtil.fromPaginationInfo(paginationInfo));

        return PaginationUtil.fromPage(page.map(SourceSummaryProjection::toModel));
    }
}
