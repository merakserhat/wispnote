package com.wispnote.backend.adapter.automation.rest.request;

import com.wispnote.backend.application.automation.model.AutomationCreate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutomationCreateRequest {

    @NotBlank(message = "{validations.automation.ruleText.blank}")
    @Size(max = 500, message = "{validations.automation.ruleText.tooLong}")
    private String ruleText;

    public AutomationCreate toModel() {
        return new AutomationCreate(ruleText);
    }
}
