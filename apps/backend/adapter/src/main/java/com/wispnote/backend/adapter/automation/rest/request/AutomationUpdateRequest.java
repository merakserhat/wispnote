package com.wispnote.backend.adapter.automation.rest.request;

import com.wispnote.backend.application.automation.model.AutomationUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutomationUpdateRequest {

    @NotBlank(message = "{validations.automation.ruleText.blank}")
    @Size(max = 500, message = "{validations.automation.ruleText.tooLong}")
    private String ruleText;

    private Boolean enabled;

    public AutomationUpdate toModel() {
        return new AutomationUpdate(ruleText, enabled);
    }
}
