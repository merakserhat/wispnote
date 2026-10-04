package com.wispnote.backend.application.member.model;

import java.util.UUID;

public record Member(UUID id, String email, String passwordHash) {
}
