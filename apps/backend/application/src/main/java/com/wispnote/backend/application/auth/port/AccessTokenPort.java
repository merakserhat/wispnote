package com.wispnote.backend.application.auth.port;

import com.wispnote.backend.application.auth.model.AccessTokenResult;

import java.util.UUID;

public interface AccessTokenPort {
    AccessTokenResult generate(UUID memberId, String email);
}