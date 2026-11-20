package com.wispnote.backend.application.auth.model;

import com.wispnote.backend.application.member.enums.MemberAccessStatus;

import java.util.UUID;

public record AuthenticatedUser(UUID memberId, boolean emailVerified, MemberAccessStatus accessStatus) {
}
