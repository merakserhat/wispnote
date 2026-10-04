package com.wispnote.backend.adapter.automation.jpa.repository;

import com.wispnote.backend.adapter.automation.jpa.entity.AutomationSuggestionEntity;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AutomationSuggestionRepository extends JpaRepository<AutomationSuggestionEntity, UUID> {

    List<AutomationSuggestionEntity> findAllByDeletedFalseOrderBySortOrderAsc(Limit limit);
}
