package com.wispnote.backend.adapter.source.jpa.repository;

import com.wispnote.backend.adapter.source.jpa.entity.SourceEntity;
import com.wispnote.backend.adapter.source.jpa.projection.SourceSummaryProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface SourceRepository extends JpaRepository<SourceEntity, UUID> {
    Optional<SourceEntity> findByMemberIdAndKeyAndDeletedFalse(UUID memberId, String key);

    @Query(value = """
            SELECT s AS source,
                   COUNT(n.id) AS noteCount,
                   COALESCE(MAX(n.createdAt), s.createdAt) AS lastActivityAt
            FROM SourceEntity s
            LEFT JOIN NoteEntity n ON n.sourceId = s.id AND n.deleted = false
            WHERE s.memberId = :memberId
            AND s.deleted = false
            AND (:kind IS NULL OR s.kind = :kind)
            GROUP BY s.id
            """,
            countQuery = """
            SELECT COUNT(s)
            FROM SourceEntity s
            WHERE s.memberId = :memberId
            AND s.deleted = false
            AND (:kind IS NULL OR s.kind = :kind)
            """)
    Page<SourceSummaryProjection> findAllSummaries(UUID memberId, String kind, Pageable pageable);
}
