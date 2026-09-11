package com.wispnote.backend.application.notegroup.model;

import java.util.UUID;

public record NoteGroup(UUID id,
                        UUID memberId,
                        String title,
                        String description) {
}
