package com.wispnote.backend.adapter.auth.rest.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenRequest {
    @NotBlank(message = "{validations.refreshToken.invalid}")
    private String token;
}
