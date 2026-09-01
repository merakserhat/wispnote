package com.wispnote.backend.application.common.auth.model;

import java.util.UUID;

public record AuthenticatedUser(UUID memberId) {
}