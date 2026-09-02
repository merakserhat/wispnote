package com.wispnote.backend.application.note;

import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.note.exception.NoteNotFoundBusinessException;
import com.wispnote.backend.application.note.model.Note;
import com.wispnote.backend.application.note.model.NoteCapture;
import com.wispnote.backend.application.note.model.NoteFilter;
import com.wispnote.backend.application.note.port.NotePort;
import com.wispnote.backend.application.note.port.SourcePort;
import com.wispnote.backend.application.note.service.SourceKeyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoteFacade {

    private final SourcePort sourcePort;
    private final NotePort notePort;

    public Note create(UUID memberId, NoteCapture capture) {
        var key = SourceKeyService.resolve(capture.source());
        var source = sourcePort.upsertByMemberIdAndKey(memberId, key, capture.source());

        return notePort.create(capture.toNote(memberId, source.id()));    }

    public Paginated<Note> list(UUID memberId, NoteFilter filter, PaginationInfo paginationInfo) {
        return notePort.findAllByMemberId(memberId, filter, paginationInfo);
    }

    public Note retrieve(UUID memberId, UUID noteId) {
        return notePort.findByIdAndMemberId(noteId, memberId)
                .orElseThrow(NoteNotFoundBusinessException::new);
    }

    public void delete(UUID memberId, UUID noteId) {
        var noteExists = notePort.existsByIdAndMemberId(noteId, memberId);

        if (!noteExists) {
            throw new NoteNotFoundBusinessException();
        }

        log.info("Note is being deleted {} {}", kv("memberId", memberId), kv("noteId", noteId));
        notePort.deleteByIdAndMemberId(noteId, memberId);
    }
}
