package com.wispnote.analyzer.adapter.noteautomationrun.jpa.entity;

import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationActionTypeConverter;
import com.wispnote.analyzer.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.analyzer.adapter.noteautomationrun.converter.NoteAutomationRunItemOutcomeConverter;
import com.wispnote.analyzer.adapter.noteautomationrun.converter.NoteAutomationRunItemStatusConverter;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItem;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "note_automation_run_item")
@SQLRestriction("deleted = false")
public class NoteAutomationRunItemEntity extends BaseEntity {
    @Version
    @Column(nullable = false)
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_id", nullable = false)
    private NoteAutomationRunEntity run;

    @Column(nullable = false)
    private UUID automationId;

    @Column(nullable = false)
    private String actionType;

    @Column(nullable = false)
    private String status;

    private String outcome;

    private Integer confidence;

    private String details;

    private UUID noteGroupId;

    public NoteAutomationRunItem toModel() {
        return new NoteAutomationRunItem(
                getId(),
                version,
                automationId,
                AutomationActionTypeConverter.entity.toEnum(actionType),
                NoteAutomationRunItemStatusConverter.entity.toEnum(status),
                NoteAutomationRunItemOutcomeConverter.entity.toEnum(outcome),
                confidence,
                details,
                noteGroupId
        );
    }
}
