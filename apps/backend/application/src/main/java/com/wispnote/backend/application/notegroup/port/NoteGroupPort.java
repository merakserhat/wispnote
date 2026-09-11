package com.wispnote.backend.application.notegroup.port;

import com.wispnote.backend.application.notegroup.model.NoteGroup;
import com.wispnote.backend.application.notegroup.model.NoteGroupFilter;
import com.wispnote.backend.application.notegroup.model.NoteGroupSummary;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NoteGroupPort {
    NoteGroup create(NoteGroup note);

    Optional<NoteGroupSummary> findByIdAndMemberId(UUID id, UUID memberId);

    boolean existsByIdAndMemberId(UUID id, UUID memberId);

    List<NoteGroupSummary> findAllByMemberId(UUID memberId, NoteGroupFilter filter);

    void deleteByIdAndMemberId(UUID id, UUID memberId);

    boolean existsNoteInGroup(UUID noteGroupId, UUID noteId);

    void addNoteToGroup(UUID noteGroupId, UUID noteId);

    void removeNoteFromGroup(UUID noteGroupId, UUID noteId);

}
