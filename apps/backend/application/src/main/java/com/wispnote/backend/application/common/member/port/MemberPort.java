package com.wispnote.backend.application.common.member.port;

import com.wispnote.backend.application.common.member.model.Member;

import java.util.Optional;

public interface MemberPort {
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
    Member create(String email, String passwordHash);
}