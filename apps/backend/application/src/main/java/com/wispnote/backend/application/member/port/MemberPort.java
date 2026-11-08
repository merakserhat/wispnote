package com.wispnote.backend.application.member.port;

import com.wispnote.backend.application.member.model.Member;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface MemberPort {
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
    Optional<Member> findById(UUID id);
    Member create(String email, String passwordHash);
    void delete(UUID id);
    void markEmailVerified(UUID id, Instant verifiedAt);
}
