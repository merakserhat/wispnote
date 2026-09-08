package com.wispnote.backend.application.note.event;

import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;

public record NoteCreatedEvent(NoteChangedMessage message) {
}
