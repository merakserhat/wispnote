package com.wispnote.backend.adapter.automation.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.backend.application.automation.model.Automation;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "automation")
public class AutomationEntity extends BaseEntity {

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false)
    private String ruleText;

    @Column(nullable = false)
    private Boolean enabled = true;

    public Automation toModel() {
        return new Automation(getId(), memberId, ruleText, enabled, getCreatedAt(), getUpdatedAt());
    }
}
