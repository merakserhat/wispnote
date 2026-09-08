package com.wispnote.backend.application.note;

import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.messagepublisher.model.NoteChangedMessage;
import com.wispnote.backend.application.note.event.NoteCreatedEvent;
import com.wispnote.backend.application.note.event.NoteDeletedEvent;
import com.wispnote.backend.application.note.exception.NoteNotFoundBusinessException;
import com.wispnote.backend.application.note.model.Note;
import com.wispnote.backend.application.note.model.NoteCapture;
import com.wispnote.backend.application.note.model.NoteFilter;
import com.wispnote.backend.application.note.port.NotePort;
import com.wispnote.backend.application.source.port.SourcePort;
import com.wispnote.backend.application.source.service.SourceKeyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoteFacade {

    private final SourcePort sourcePort;
    private final NotePort notePort;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public Note create(UUID memberId, NoteCapture capture) {
        var key = SourceKeyService.resolve(capture.source());
        var source = sourcePort.upsertByMemberIdAndKey(memberId, key, capture.source());

        var note = notePort.create(capture.toNote(memberId, source.id()));
        applicationEventPublisher.publishEvent(new NoteCreatedEvent(NoteChangedMessage.created(note)));

        return note;
    }

    public Paginated<Note> list(UUID memberId, NoteFilter filter, PaginationInfo paginationInfo) {
        return notePort.findAllByMemberId(memberId, filter, paginationInfo);
    }

    public Note retrieve(UUID memberId, UUID noteId) {
        return notePort.findByIdAndMemberId(noteId, memberId)
                .orElseThrow(NoteNotFoundBusinessException::new);
    }

    @Transactional
    public void delete(UUID memberId, UUID noteId) {
        var note = retrieve(memberId, noteId);

        log.info("Note is being deleted {} {}", kv("memberId", memberId), kv("noteId", noteId));
        notePort.deleteByIdAndMemberId(noteId, memberId);
        applicationEventPublisher.publishEvent(new NoteDeletedEvent(NoteChangedMessage.deleted(note)));
    }
}
