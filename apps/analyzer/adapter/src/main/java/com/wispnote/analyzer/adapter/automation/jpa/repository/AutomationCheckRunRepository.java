package com.wispnote.analyzer.adapter.automation.jpa.repository;

import com.wispnote.analyzer.adapter.automation.jpa.entity.AutomationCheckRunEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AutomationCheckRunRepository extends JpaRepository<AutomationCheckRunEntity, UUID> {

    Optional<AutomationCheckRunEntity> findByAutomationId(UUID automationId);
}
