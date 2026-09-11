package com.wispnote.backend.adapter.notegroup.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.backend.application.notegroup.model.NoteGroup;
import com.wispnote.backend.application.notegroup.model.NoteGroupSummary;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "note_group")
public class NoteGroupEntity extends BaseEntity {

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false)
    private String title;

    private String description;

    public NoteGroup toModel() {
        return new NoteGroup(getId(),
                memberId,
                title,
                description);
    }

    public NoteGroupSummary toSummary(long noteCount) {
        return new NoteGroupSummary(toModel(), noteCount);
    }
}
