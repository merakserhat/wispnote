package com.wispnote.backend.adapter.auth.rest.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {
    @NotBlank(message = "{validations.googleLogin.code.blank}")
    private String code;

    @Size(min = 43, max = 128, message = "{validations.googleLogin.codeVerifier.invalid}")
    @NotBlank(message = "{validations.googleLogin.codeVerifier.blank}")
    private String codeVerifier;

    @NotBlank(message = "{validations.googleLogin.redirectUri.blank}")
    private String redirectUri;
}
