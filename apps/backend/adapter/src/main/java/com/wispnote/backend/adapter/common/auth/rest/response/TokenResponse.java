package com.wispnote.backend.adapter.common.auth.rest.response;

import com.wispnote.backend.application.common.auth.model.AccessTokenResult;

public record TokenResponse(String accessToken, String tokenType, Integer expiresIn) {

    public static TokenResponse from(AccessTokenResult result) {
        return new TokenResponse(result.accessToken(), result.tokenType(), result.expiresIn());
    }
}