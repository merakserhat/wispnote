package com.wispnote.backend.application.auth.model;

public record GoogleIdentity(String subject, String email, boolean emailVerified) {
}
