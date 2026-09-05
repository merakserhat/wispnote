package com.wispnote.backend.adapter.automation.jpa;

import com.wispnote.backend.adapter.automation.jpa.entity.AutomationEntity;
import com.wispnote.backend.adapter.automation.jpa.repository.AutomationRepository;
import com.wispnote.backend.adapter.automation.jpa.specification.AutomationSpecification;
import com.wispnote.backend.adapter.common.exception.EntityNotFoundException;
import com.wispnote.backend.adapter.common.util.PaginationUtil;
import com.wispnote.backend.application.automation.model.Automation;
import com.wispnote.backend.application.automation.model.AutomationFilter;
import com.wispnote.backend.application.automation.port.AutomationPort;
import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AutomationJpaAdapter implements AutomationPort {

    private final AutomationRepository automationRepository;

    @Override
    public Automation create(Automation automation) {
        var entity = new AutomationEntity();
        entity.setMemberId(automation.memberId());
        entity.setRuleText(automation.ruleText());
        entity.setEnabled(automation.enabled());

        return automationRepository.save(entity).toModel();
    }

    @Override
    public Optional<Automation> findByIdAndMemberId(UUID id, UUID memberId) {
        return automationRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                .map(AutomationEntity::toModel);
    }

    @Override
    public Paginated<Automation> findAllByMemberId(UUID memberId, AutomationFilter filter, PaginationInfo paginationInfo) {
        var page = automationRepository.findAll(
                AutomationSpecification.of(memberId, filter),
                PaginationUtil.fromPaginationInfo(paginationInfo));

        return PaginationUtil.fromPage(page.map(AutomationEntity::toModel));
    }

    @Override
    public long countEnabledByMemberId(UUID memberId) {
        return automationRepository.countByMemberIdAndEnabledTrueAndDeletedFalse(memberId);
    }

    @Override
    public Automation update(Automation automation) {
        var entity = automationRepository.findByIdAndMemberIdAndDeletedFalse(automation.id(), automation.memberId())
                .orElseThrow(EntityNotFoundException::new);
        entity.setRuleText(automation.ruleText());
        entity.setEnabled(automation.enabled());

        return automationRepository.save(entity).toModel();
    }

    @Override
    public void deleteByIdAndMemberId(UUID id, UUID memberId) {
        var entity = automationRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                .orElseThrow(EntityNotFoundException::new);
        entity.setDeleted(true);
        automationRepository.save(entity);
    }
}
