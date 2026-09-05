package com.wispnote.backend.adapter.automation.jpa;

import com.wispnote.backend.adapter.automation.jpa.entity.AutomationSuggestionEntity;
import com.wispnote.backend.adapter.automation.jpa.repository.AutomationSuggestionRepository;
import com.wispnote.backend.application.automation.model.AutomationSuggestion;
import com.wispnote.backend.application.automation.port.AutomationSuggestionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AutomationSuggestionJpaAdapter implements AutomationSuggestionPort {

    private final AutomationSuggestionRepository automationSuggestionRepository;

    @Override
    public List<AutomationSuggestion> findAll(int size) {
        return automationSuggestionRepository.findAllByDeletedFalseOrderBySortOrderAsc(Limit.of(size))
                .stream()
                .map(AutomationSuggestionEntity::toModel)
                .toList();
    }
}
