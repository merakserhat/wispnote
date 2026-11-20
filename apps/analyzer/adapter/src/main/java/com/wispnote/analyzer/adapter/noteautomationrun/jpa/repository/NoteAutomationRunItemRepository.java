package com.wispnote.analyzer.adapter.noteautomationrun.jpa.repository;

import com.wispnote.analyzer.adapter.noteautomationrun.jpa.entity.NoteAutomationRunItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface NoteAutomationRunItemRepository extends JpaRepository<NoteAutomationRunItemEntity, UUID> {

    @Query("""
            SELECT i FROM NoteAutomationRunItemEntity i
            WHERE i.run.id = :noteAutomationRunId
            AND i.deleted = false
            ORDER BY i.createdAt, i.id
            """)
    List<NoteAutomationRunItemEntity> findAllByNoteAutomationRunIdAndDeletedFalse(UUID noteAutomationRunId);
}
