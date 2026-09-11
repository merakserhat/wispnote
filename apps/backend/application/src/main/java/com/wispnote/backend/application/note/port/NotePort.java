package com.wispnote.backend.application.note.port;

import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.note.model.Note;
import com.wispnote.backend.application.note.model.NoteFilter;

import java.util.Optional;
import java.util.UUID;

public interface NotePort {
    Note create(Note note);

    Optional<Note> findByIdAndMemberId(UUID id, UUID memberId);

    boolean existsByIdAndMemberId(UUID id, UUID memberId);

    Paginated<Note> findAllByMemberId(UUID memberId, NoteFilter filter, PaginationInfo paginationInfo);

    void deleteByIdAndMemberId(UUID id, UUID memberId);
}
