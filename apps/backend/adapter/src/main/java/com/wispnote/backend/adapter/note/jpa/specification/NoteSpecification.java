package com.wispnote.backend.adapter.note.jpa.specification;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity_;
import com.wispnote.backend.adapter.common.jpa.util.SpecificationUtil;
import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity;
import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity_;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupEntity;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupEntity_;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupNoteEntity;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupNoteEntity_;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class NoteSpecification {

    public static Specification<NoteEntity> belongsToMember(UUID memberId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get(NoteEntity_.MEMBER_ID), memberId);
    }

    public static Specification<NoteEntity> sourceId(UUID sourceId) {
        return (root, query, criteriaBuilder) -> SpecificationUtil.equal(
                criteriaBuilder, root.get(NoteEntity_.SOURCE_ID), sourceId);
    }

    public static Specification<NoteEntity> kind(String kind) {
        return (root, query, criteriaBuilder) -> SpecificationUtil.equal(
                criteriaBuilder, root.get(NoteEntity_.KIND), kind);
    }

    public static Specification<NoteEntity> selectedTextLike(String search) {
        return (root, query, criteriaBuilder) -> SpecificationUtil.like(
                criteriaBuilder, root.get(NoteEntity_.SELECTED_TEXT), search);
    }

    public static Specification<NoteEntity> belongsToNoteGroup(UUID memberId, UUID noteGroupId) {
        return (root, query, criteriaBuilder) -> {
            if (noteGroupId == null) {
                return criteriaBuilder.conjunction();
            }

            var subquery = query.subquery(UUID.class);
            var membership = subquery.from(NoteGroupNoteEntity.class);
            var noteGroup = subquery.from(NoteGroupEntity.class);

            subquery.select(membership.get(BaseEntity_.ID))
                    .where(
                            criteriaBuilder.equal(membership.get(NoteGroupNoteEntity_.NOTE_ID),
                                    root.get(BaseEntity_.ID)),
                            criteriaBuilder.equal(membership.get(NoteGroupNoteEntity_.NOTE_GROUP_ID),
                                    noteGroup.get(BaseEntity_.ID)),
                            criteriaBuilder.equal(noteGroup.get(BaseEntity_.ID), noteGroupId),
                            criteriaBuilder.equal(noteGroup.get(NoteGroupEntity_.MEMBER_ID), memberId),
                            criteriaBuilder.isFalse(noteGroup.get(BaseEntity_.DELETED)),
                            criteriaBuilder.isFalse(membership.get(BaseEntity_.DELETED)));

            return criteriaBuilder.exists(subquery);
        };
    }
}
