package com.wispnote.backend.adapter.auth.rest.response;

import com.wispnote.backend.application.auth.model.AccessTokenResult;

public record TokenResponse(String accessToken, String refreshToken, String tokenType, Integer expiresIn) {

    public static TokenResponse from(AccessTokenResult result) {
        return new TokenResponse(result.accessToken(), result.refreshToken(), result.tokenType(), result.expiresIn());
    }
}
