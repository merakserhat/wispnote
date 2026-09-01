package com.wispnote.backend.application.common.auth.port;

public interface PasswordHasherPort {
    String hash(String rawPassword);
}
