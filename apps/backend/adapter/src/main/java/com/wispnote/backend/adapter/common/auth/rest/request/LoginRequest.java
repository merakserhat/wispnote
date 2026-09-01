package com.wispnote.backend.adapter.common.auth.rest.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @Email(message = "{validations.email.invalid}")
    @NotBlank(message = "{validations.email.blank}")
    private String email;

    @NotBlank(message = "{validations.password.blank}")
    private String password;
}