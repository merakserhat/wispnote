package com.wispnote.backend.adapter.note.jpa.repository;

import com.wispnote.backend.adapter.note.jpa.entity.SourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SourceRepository extends JpaRepository<SourceEntity, UUID> {
    Optional<SourceEntity> findByMemberIdAndKeyAndDeletedFalse(UUID memberId, String key);
}
