package com.wispnote.backend.adapter.note.jpa.repository;

import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<NoteEntity, UUID>, JpaSpecificationExecutor<NoteEntity> {
    Optional<NoteEntity> findByIdAndMemberIdAndDeletedFalse(UUID id, UUID memberId);

    boolean existsByIdAndMemberIdAndDeletedFalse(UUID id, UUID memberId);
}
