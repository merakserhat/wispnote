package com.wispnote.backend.adapter.emailverification.jpa.repository;

import com.wispnote.backend.adapter.emailverification.jpa.entity.EmailVerificationEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationRepository extends JpaRepository<EmailVerificationEntity, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select v from EmailVerificationEntity v
            where v.memberId = :memberId and v.status = :status and v.deleted = false
            order by v.createdAt desc
            """)
    List<EmailVerificationEntity> lockAllByMemberIdAndStatusAndDeletedFalseOrderByCreatedAtDesc(UUID memberId, String status);

    List<EmailVerificationEntity> findAllByEmailAndCreatedAtGreaterThanEqualAndDeletedFalseOrderByCreatedAtAsc(String email, Instant from);
    Optional<EmailVerificationEntity> findByIdAndDeletedFalse(UUID id);
}
