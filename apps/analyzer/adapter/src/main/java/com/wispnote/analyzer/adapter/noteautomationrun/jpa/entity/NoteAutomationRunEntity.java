package com.wispnote.analyzer.adapter.noteautomationrun.jpa.entity;

import com.wispnote.analyzer.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRun;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItems;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "note_automation_run")
@SQLRestriction("deleted = false")
public class NoteAutomationRunEntity extends BaseEntity {
    @Version
    @Column(nullable = false)
    private Long version;

    @Column(nullable = false)
    private UUID noteId;

    @Column(nullable = false)
    private UUID memberId;

    public NoteAutomationRun toModel(List<NoteAutomationRunItemEntity> items) {
        return new NoteAutomationRun(
                getId(),
                version,
                noteId,
                memberId,
                getUpdatedAt() != null ? getUpdatedAt() : getCreatedAt(),
                new NoteAutomationRunItems(items.stream().map(NoteAutomationRunItemEntity::toModel).toList())
        );
    }
}
