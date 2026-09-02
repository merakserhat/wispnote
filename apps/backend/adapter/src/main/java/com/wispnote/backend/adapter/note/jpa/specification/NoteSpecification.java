package com.wispnote.backend.adapter.note.jpa.specification;

import com.wispnote.backend.adapter.common.jpa.util.SpecificationUtil;
import com.wispnote.backend.adapter.note.converter.NoteKindConverter;
import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity;
import com.wispnote.backend.application.note.model.NoteFilter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class NoteSpecification {

    public static Specification<NoteEntity> of(UUID memberId, NoteFilter filter) {
        return (root, query, builder) -> builder.and(
                builder.equal(root.get("memberId"), memberId),
                builder.isFalse(root.get("deleted")),
                SpecificationUtil.equal(builder, root.get("sourceId"), filter.sourceId()),
                SpecificationUtil.equal(builder, root.get("kind"),
                        NoteKindConverter.jpa.fromEnum(filter.kind())),
                SpecificationUtil.like(builder, root.get("selectedText"), filter.search()));
    }
}
