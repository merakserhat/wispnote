package com.wispnote.backend.adapter.automation.jpa.specification;

import com.wispnote.backend.adapter.automation.jpa.entity.AutomationEntity;
import com.wispnote.backend.adapter.common.jpa.util.SpecificationUtil;
import com.wispnote.backend.application.automation.model.AutomationFilter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class AutomationSpecification {

    public static Specification<AutomationEntity> of(UUID memberId, AutomationFilter filter) {
        return (root, query, builder) -> builder.and(
                builder.equal(root.get("memberId"), memberId),
                builder.isFalse(root.get("deleted")),
                SpecificationUtil.equal(builder, root.get("enabled"), filter.enabled()));
    }
}
