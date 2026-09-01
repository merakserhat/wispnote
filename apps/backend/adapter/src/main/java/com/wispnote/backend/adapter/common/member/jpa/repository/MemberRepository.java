package com.wispnote.backend.adapter.common.member.jpa.repository;

import com.wispnote.backend.adapter.common.member.jpa.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
    Optional<MemberEntity> findByEmailAndDeletedFalse(String email);
    boolean existsByEmailAndDeletedFalse(String email);
}
