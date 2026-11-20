package com.wispnote.analyzer.application.noteautomationrun.service;

import com.wispnote.analyzer.application.note.model.NoteChangedEvent;
import com.wispnote.analyzer.application.note.port.NotePort;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItems;
import com.wispnote.analyzer.application.noteautomationrun.port.NoteAutomationRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteAutomationRunTriggerService {
    private final NotePort notePort;
    private final RunnableAutomationResolverService runnableAutomationResolverService;
    private final NoteAutomationRunPersistencePort noteAutomationRunPersistencePort;
    private final NoteAutomationRunHandlerService noteAutomationRunHandlerService;

    public void trigger(NoteChangedEvent event) {
        log.info("Triggering note automation run {} {}",
                kv("noteId", event.noteId()),
                kv("memberId", event.memberId()));
        var existingRun = noteAutomationRunPersistencePort.findByNoteId(event.noteId());
        if (existingRun.isPresent() && existingRun.get().isCompleted()) {
            log.info("Note automation run already completed, skipping {}", kv("noteAutomationRunId", existingRun.get().id()));
            return;
        }

        var note = notePort.retrieveById(event.memberId(), event.noteId());
        var automations = runnableAutomationResolverService.resolve(note.memberId());

        if (existingRun.isPresent()) {
            noteAutomationRunHandlerService.handle(existingRun.get(), note, automations);
            return;
        }

        if (automations.isEmpty()) {
            log.info("No runnable automation, skipping note automation run {}", kv("noteId", note.id()));
            return;
        }
        var createdRun = noteAutomationRunPersistencePort.create(
                note.id(), note.memberId(), NoteAutomationRunItems.pending(automations));
        noteAutomationRunHandlerService.handle(createdRun, note, automations);
    }
}
