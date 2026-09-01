package com.wispnote.backend.application.common.auth.port;

import com.wispnote.backend.application.common.auth.model.AccessTokenResult;

import java.util.UUID;

public interface AccessTokenPort {
    AccessTokenResult generate(UUID memberId, String email);
}