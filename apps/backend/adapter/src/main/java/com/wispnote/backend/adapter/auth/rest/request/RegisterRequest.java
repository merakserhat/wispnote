package com.wispnote.backend.adapter.auth.rest.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Locale;

@Getter
@Setter
public class RegisterRequest {
    @Email(message = "{validations.email.invalid}")
    @NotBlank(message = "{validations.email.blank}")
    private String email;

    @Size(min = 8, message = "{validations.password.tooShort}")
    @NotBlank(message = "{validations.password.blank}")
    private String password;

    @NotBlank(message = "{validations.passwordConfirm.blank}")
    private String passwordConfirm;

    public void setEmail(String email) {
        this.email = email == null ? null : email.toLowerCase(Locale.ROOT);
    }
}
