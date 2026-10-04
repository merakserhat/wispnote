package com.wispnote.backend.application.messagepublisher.listener;

import com.wispnote.backend.application.messagepublisher.port.MessagePublisherPort;
import com.wispnote.backend.application.note.event.NoteCreatedEvent;
import com.wispnote.backend.application.note.event.NoteDeletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class MessagePublisherEventListener {

    private final MessagePublisherPort messagePublisherPort;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishMessage(NoteCreatedEvent noteCreatedEvent) {
        messagePublisherPort.publishNoteCreated(noteCreatedEvent.message());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishMessage(NoteDeletedEvent noteDeletedEvent) {
        messagePublisherPort.publishNoteDeleted(noteDeletedEvent.message());
    }

}
