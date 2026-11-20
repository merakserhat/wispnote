package com.wispnote.analyzer.adapter.noteautomationrun.jpa.repository;

import com.wispnote.analyzer.adapter.noteautomationrun.jpa.entity.NoteAutomationRunEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NoteAutomationRunRepository extends JpaRepository<NoteAutomationRunEntity, UUID> {

    Optional<NoteAutomationRunEntity> findByNoteId(UUID noteId);
}
