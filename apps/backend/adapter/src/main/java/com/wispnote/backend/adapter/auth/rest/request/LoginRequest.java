package com.wispnote.backend.adapter.auth.rest.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Locale;

@Getter
@Setter
public class LoginRequest {
    @Email(message = "{validations.email.invalid}")
    @NotBlank(message = "{validations.email.blank}")
    private String email;

    @NotBlank(message = "{validations.password.blank}")
    private String password;

    public void setEmail(String email) {
        this.email = email == null ? null : email.toLowerCase(Locale.ROOT);
    }
}
