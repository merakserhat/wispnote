package com.wispnote.backend.application.auth.model;

public record AccessTokenResult(String accessToken, String refreshToken, String tokenType, Integer expiresIn) {
}
