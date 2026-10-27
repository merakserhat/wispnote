package com.wispnote.analyzer.application.notegroup.model;

import java.util.UUID;

public record NoteGroup(UUID id,
                        String title,
                        String description) {
}
