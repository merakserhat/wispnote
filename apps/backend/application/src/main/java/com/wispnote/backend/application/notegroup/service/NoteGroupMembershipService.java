package com.wispnote.backend.application.notegroup.service;

import com.wispnote.backend.application.note.exception.NoteNotFoundBusinessException;
import com.wispnote.backend.application.note.port.NotePort;
import com.wispnote.backend.application.notegroup.exception.NoteGroupMembershipNotFoundBusinessException;
import com.wispnote.backend.application.notegroup.exception.NoteGroupNotFoundBusinessException;
import com.wispnote.backend.application.notegroup.port.NoteGroupPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteGroupMembershipService {

    private final NotePort notePort;
    private final NoteGroupPort noteGroupPort;

    @Transactional
    public void addNoteToGroup(UUID memberId, UUID noteGroupId, UUID noteId) {
        validateMemberOwnsGroupAndNote(memberId, noteGroupId, noteId);

        if (noteGroupPort.existsNoteInGroup(noteGroupId, noteId)) {
            log.info("Note is already in note group {} {}", kv("noteGroupId", noteGroupId), kv("noteId", noteId));
            return;
        }

        noteGroupPort.addNoteToGroup(noteGroupId, noteId);
    }

    @Transactional
    public void removeNoteFromGroup(UUID memberId, UUID noteGroupId, UUID noteId) {
        validateMemberOwnsGroupAndNote(memberId, noteGroupId, noteId);

        if (!noteGroupPort.existsNoteInGroup(noteGroupId, noteId)) {
            throw new NoteGroupMembershipNotFoundBusinessException();
        }

        noteGroupPort.removeNoteFromGroup(noteGroupId, noteId);
    }

    private void validateMemberOwnsGroupAndNote(UUID memberId, UUID noteGroupId, UUID noteId) {
        if (!noteGroupPort.existsByIdAndMemberId(noteGroupId, memberId)) {
            throw new NoteGroupNotFoundBusinessException();
        }

        if (!notePort.existsByIdAndMemberId(noteId, memberId)) {
            throw new NoteNotFoundBusinessException();
        }
    }
}
