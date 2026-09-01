package com.wispnote.backend.application.common.auth.model;

public record AccessTokenResult(String accessToken, String tokenType, Integer expiresIn) {
}
