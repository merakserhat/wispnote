package com.wispnote.backend.adapter.notegroup.jpa.repository;

import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface NoteGroupRepository extends JpaRepository<NoteGroupEntity, UUID>, JpaSpecificationExecutor<NoteGroupEntity> {
    Optional<NoteGroupEntity> findByIdAndMemberIdAndDeletedFalse(UUID id, UUID memberId);

    boolean existsByIdAndMemberIdAndDeletedFalse(UUID id, UUID memberId);
}
