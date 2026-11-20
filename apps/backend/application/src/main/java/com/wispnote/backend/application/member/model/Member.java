package com.wispnote.backend.application.member.model;

import com.wispnote.backend.application.member.enums.MemberAccessStatus;

import java.time.Instant;
import java.util.UUID;

public record Member(UUID id,
                     String email,
                     String passwordHash,
                     Instant emailVerifiedAt,
                     String googleId,
                     MemberAccessStatus accessStatus) {

    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }
}
