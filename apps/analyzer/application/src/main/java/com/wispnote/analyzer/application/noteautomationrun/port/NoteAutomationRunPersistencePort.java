package com.wispnote.analyzer.application.noteautomationrun.port;

import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRun;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItems;

import java.util.Optional;
import java.util.UUID;

public interface NoteAutomationRunPersistencePort {

    NoteAutomationRun create(UUID noteId, UUID memberId, NoteAutomationRunItems items);

    NoteAutomationRun update(NoteAutomationRun noteAutomationRun);

    Optional<NoteAutomationRun> findByNoteId(UUID noteId);
}
