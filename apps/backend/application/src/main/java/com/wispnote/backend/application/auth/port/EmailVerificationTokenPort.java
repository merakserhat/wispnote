package com.wispnote.backend.application.auth.port;

import com.wispnote.backend.application.auth.model.EmailVerificationTokenResult;

import java.util.UUID;

public interface EmailVerificationTokenPort {
    EmailVerificationTokenResult generate(UUID memberId, String email);
}
