package com.wispnote.backend.adapter.automation.jpa.specification;

import com.wispnote.backend.adapter.automation.jpa.entity.AutomationEntity;
import com.wispnote.backend.adapter.automation.jpa.entity.AutomationEntity_;
import com.wispnote.backend.adapter.common.jpa.util.SpecificationUtil;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class AutomationSpecification {

    public static Specification<AutomationEntity> belongsToMember(UUID memberId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get(AutomationEntity_.MEMBER_ID), memberId);
    }

    public static Specification<AutomationEntity> enabled(Boolean enabled) {
        return (root, query, criteriaBuilder) -> SpecificationUtil.equal(
                criteriaBuilder, root.get(AutomationEntity_.ENABLED), enabled);
    }
}
