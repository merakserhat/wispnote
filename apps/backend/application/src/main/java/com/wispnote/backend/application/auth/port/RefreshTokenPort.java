package com.wispnote.backend.application.auth.port;

import java.util.UUID;

public interface RefreshTokenPort {
    UUID readMemberId(String refreshToken);
}
