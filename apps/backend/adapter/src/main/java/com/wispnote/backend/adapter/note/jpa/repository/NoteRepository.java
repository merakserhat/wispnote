package com.wispnote.backend.adapter.note.jpa.repository;

import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<NoteEntity, UUID>, JpaSpecificationExecutor<NoteEntity> {
    Optional<NoteEntity> findByIdAndMemberIdAndDeletedFalse(UUID id, UUID memberId);

    @Query("""
            SELECT count(n) > 0
            FROM NoteEntity n
            WHERE n.id = :id
            AND n.memberId = :memberId
            AND n.deleted = false
            """)
    boolean existsByIdAndMemberId(UUID id, UUID memberId);

}
