package com.wispnote.backend.adapter.automation.rest.request;

import com.wispnote.backend.application.automation.model.AutomationUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutomationToggleRequest {

    @NotNull(message = "{validations.automation.enabled.empty}")
    private Boolean enabled;

    public AutomationUpdate toModel() {
        return new AutomationUpdate(null, enabled);
    }
}
