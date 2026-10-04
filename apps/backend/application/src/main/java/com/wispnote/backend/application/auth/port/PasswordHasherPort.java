package com.wispnote.backend.application.auth.port;

public interface PasswordHasherPort {
    String hash(String rawPassword);
}
