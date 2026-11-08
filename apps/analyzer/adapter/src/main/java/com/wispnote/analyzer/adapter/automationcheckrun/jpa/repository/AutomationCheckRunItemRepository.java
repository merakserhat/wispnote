package com.wispnote.analyzer.adapter.automationcheckrun.jpa.repository;

import com.wispnote.analyzer.adapter.automationcheckrun.jpa.entity.AutomationCheckRunItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface AutomationCheckRunItemRepository extends JpaRepository<AutomationCheckRunItemEntity, UUID> {

    @Query("""
            SELECT i FROM AutomationCheckRunItemEntity i
            WHERE i.run.id = :automationCheckRunId
            AND i.deleted = false
            ORDER BY i.createdAt
            """)
    Set<AutomationCheckRunItemEntity> findAllByAutomationCheckRunIdAndDeletedFalse(UUID automationCheckRunId);

    @Query("""
            SELECT i FROM AutomationCheckRunItemEntity i
            JOIN FETCH i.run
            WHERE i.run.id IN :automationCheckRunIds
            AND i.deleted = false
            ORDER BY i.createdAt
            """)
    List<AutomationCheckRunItemEntity> findAllByAutomationCheckRunIdInAndDeletedFalse(Collection<UUID> automationCheckRunIds);
}
