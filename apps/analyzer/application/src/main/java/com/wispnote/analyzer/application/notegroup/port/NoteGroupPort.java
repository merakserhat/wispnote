package com.wispnote.analyzer.application.notegroup.port;

import com.wispnote.analyzer.application.notegroup.model.NoteGroup;

import java.util.List;
import java.util.UUID;

public interface NoteGroupPort {

    List<NoteGroup> findAllByMemberId(UUID memberId);
}
