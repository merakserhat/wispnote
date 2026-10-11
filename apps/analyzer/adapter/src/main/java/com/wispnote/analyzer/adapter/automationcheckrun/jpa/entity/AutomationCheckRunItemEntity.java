package com.wispnote.analyzer.adapter.automationcheckrun.jpa.entity;

import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationActionTypeConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunItemOutcomeConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunItemStatusConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunRejectionReasonConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunStageConverter;
import com.wispnote.analyzer.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItem;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Setter
@Entity
@Table(name = "automation_check_run_item")
@SQLRestriction("deleted = false")
public class AutomationCheckRunItemEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_id", nullable = false)
    private AutomationCheckRunEntity run;

    @Column(nullable = false)
    private String stage;

    @Column(nullable = false)
    private String status;

    private String outcome;

    private String rejectionReason;

    private String details;

    private Integer confidence;

    private String decidedActionType;

    private String condition;

    private String requiredGroupTitle;

    public AutomationCheckRunItem toModel() {
        return new AutomationCheckRunItem(
                getId(),
                AutomationCheckRunStageConverter.entity.toEnum(stage),
                AutomationCheckRunItemStatusConverter.entity.toEnum(status),
                AutomationCheckRunItemOutcomeConverter.entity.toEnum(outcome),
                AutomationCheckRunRejectionReasonConverter.entity.toEnum(rejectionReason),
                details,
                confidence,
                AutomationActionTypeConverter.entity.toEnum(decidedActionType),
                condition,
                requiredGroupTitle
        );
    }
}
