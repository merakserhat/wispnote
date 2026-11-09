package com.wispnote.backend.application.member.model;

import java.time.Instant;
import java.util.UUID;

public record Member(UUID id, String email, String passwordHash, Instant emailVerifiedAt, String googleId) {

    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }
}
