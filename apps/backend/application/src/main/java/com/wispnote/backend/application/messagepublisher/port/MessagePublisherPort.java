package com.wispnote.backend.application.messagepublisher.port;

import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;

public interface MessagePublisherPort {
    void publishNoteCreated(NoteChangedMessage message);
    void publishNoteDeleted(NoteChangedMessage message);
}
