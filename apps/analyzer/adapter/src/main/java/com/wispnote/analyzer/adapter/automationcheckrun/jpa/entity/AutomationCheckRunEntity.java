package com.wispnote.analyzer.adapter.automationcheckrun.jpa.entity;

import com.wispnote.analyzer.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItem;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItems;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationFingerprint;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "automation_check_run")
@SQLRestriction("deleted = false")
public class AutomationCheckRunEntity extends BaseEntity {

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(nullable = false)
    private UUID automationId;

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false)
    private Integer fingerprint;

    private Integer confidence;
    public AutomationCheckRun toModel(Set<AutomationCheckRunItemEntity> items) {
        return new AutomationCheckRun(
                getId(),
                version,
                automationId,
                memberId,
                new AutomationFingerprint(fingerprint),
                confidence,
                new AutomationCheckRunItems(items.stream().map(AutomationCheckRunItemEntity::toModel).toList())
        );
    }
}
