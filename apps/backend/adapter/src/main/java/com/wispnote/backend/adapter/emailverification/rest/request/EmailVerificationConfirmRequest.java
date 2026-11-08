package com.wispnote.backend.adapter.emailverification.rest.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerificationConfirmRequest {
    @Pattern(regexp = "\\d{6}", message = "{validations.emailVerification.code.invalid}")
    @NotBlank(message = "{validations.emailVerification.code.blank}")
    private String code;
}
