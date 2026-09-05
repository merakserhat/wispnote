package com.wispnote.backend.adapter.automation.jpa.repository;

import com.wispnote.backend.adapter.automation.jpa.entity.AutomationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface AutomationRepository extends JpaRepository<AutomationEntity, UUID>,
        JpaSpecificationExecutor<AutomationEntity> {

    Optional<AutomationEntity> findByIdAndMemberIdAndDeletedFalse(UUID id, UUID memberId);

    long countByMemberIdAndEnabledTrueAndDeletedFalse(UUID memberId);
}
