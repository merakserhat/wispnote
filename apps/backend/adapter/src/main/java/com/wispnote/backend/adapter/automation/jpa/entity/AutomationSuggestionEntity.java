package com.wispnote.backend.adapter.automation.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.backend.application.automation.model.AutomationSuggestion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "automation_suggestion")
public class AutomationSuggestionEntity extends BaseEntity {

    @Column(nullable = false)
    private String ruleText;

    @Column(nullable = false)
    private Integer sortOrder;

    public AutomationSuggestion toModel() {
        return new AutomationSuggestion(getId(), ruleText);
    }
}
