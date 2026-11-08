package com.wispnote.backend.application.auth.model;

import com.wispnote.backend.application.member.model.Member;

public record RegisterResult(Member member, EmailVerificationTokenResult verificationToken, Integer codeExpiresInSeconds) {
}
