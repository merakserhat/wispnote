package com.wispnote.backend.application.messagepublisher.port;

import com.wispnote.backend.application.messagepublisher.model.AutomationChangedMessage;
import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;

public interface MessagePublisherPort {
    void publishNoteCreated(NoteChangedMessage message);
    void publishNoteDeleted(NoteChangedMessage message);
    void publishAutomationCreated(AutomationChangedMessage message);
    void publishAutomationUpdated(AutomationChangedMessage message);
}
