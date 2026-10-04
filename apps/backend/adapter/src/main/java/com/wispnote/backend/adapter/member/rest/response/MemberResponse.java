package com.wispnote.backend.adapter.member.rest.response;

import java.util.UUID;

public record MemberResponse(UUID id, String email) {
}