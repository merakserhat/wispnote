package com.wispnote.backend.adapter.notegroup.jpa.specification;

import com.wispnote.backend.adapter.common.jpa.util.SpecificationUtil;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupEntity;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupEntity_;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class NoteGroupSpecification {

    public static Specification<NoteGroupEntity> belongsToMember(UUID memberId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get(NoteGroupEntity_.MEMBER_ID), memberId);
    }

    public static Specification<NoteGroupEntity> titleOrDescriptionLike(String search) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.or(
                SpecificationUtil.like(criteriaBuilder, root.get(NoteGroupEntity_.TITLE), search),
                SpecificationUtil.like(criteriaBuilder, root.get(NoteGroupEntity_.DESCRIPTION), search));
    }
}
