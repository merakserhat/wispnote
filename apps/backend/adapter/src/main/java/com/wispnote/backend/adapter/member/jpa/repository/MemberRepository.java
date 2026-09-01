package com.wispnote.backend.adapter.member.jpa.repository;

import com.wispnote.backend.adapter.member.jpa.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
    Optional<MemberEntity> findByEmailAndDeletedFalse(String email);
    Optional<MemberEntity> findByIdAndDeletedFalse(UUID id);
    boolean existsByEmailAndDeletedFalse(String email);
}
