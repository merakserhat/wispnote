package com.wispnote.backend.application.automation.port;

import com.wispnote.backend.application.automation.model.Automation;
import com.wispnote.backend.application.automation.model.AutomationFilter;
import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;

import java.util.Optional;
import java.util.UUID;

public interface AutomationPort {
    Automation create(Automation automation);

    Optional<Automation> findByIdAndMemberId(UUID id, UUID memberId);

    Paginated<Automation> findAllByMemberId(UUID memberId, AutomationFilter filter, PaginationInfo paginationInfo);

    long countEnabledByMemberId(UUID memberId);

    boolean existsByMemberId(UUID memberId);

    Automation update(Automation automation);

    void deleteByIdAndMemberId(UUID id, UUID memberId);
}
