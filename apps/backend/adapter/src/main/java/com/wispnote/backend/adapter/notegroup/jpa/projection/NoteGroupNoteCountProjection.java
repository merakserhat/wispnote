package com.wispnote.backend.adapter.notegroup.jpa.projection;

import java.util.UUID;

public interface NoteGroupNoteCountProjection {
    UUID getNoteGroupId();

    Long getNoteCount();
}
