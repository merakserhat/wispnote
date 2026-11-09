package com.wispnote.backend.application.member.port;

import com.wispnote.backend.application.member.model.Member;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface MemberPort {
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
    Optional<Member> findById(UUID id);
    Optional<Member> findByGoogleId(String googleId);
    Member create(String email, String passwordHash);
    Member createWithGoogle(String email, String googleId, Instant emailVerifiedAt);
    void linkGoogle(UUID id, String googleId);
    void delete(UUID id);
    void markEmailVerified(UUID id, Instant verifiedAt);
}
