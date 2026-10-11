package com.wispnote.analyzer.adapter.automation.jpa.repository;

import com.wispnote.analyzer.adapter.automation.jpa.entity.AutomationCheckRunItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
