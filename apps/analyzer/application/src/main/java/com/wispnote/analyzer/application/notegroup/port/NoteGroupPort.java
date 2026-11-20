package com.wispnote.analyzer.application.notegroup.port;

import com.wispnote.analyzer.application.notegroup.model.NoteGroups;

import java.util.UUID;

public interface NoteGroupPort {

    NoteGroups findAllByMemberId(UUID memberId);

    void addNote(UUID memberId, UUID noteGroupId, UUID noteId);
}
