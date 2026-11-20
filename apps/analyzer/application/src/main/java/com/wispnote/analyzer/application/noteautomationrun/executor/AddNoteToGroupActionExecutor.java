package com.wispnote.analyzer.application.noteautomationrun.executor;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.notegroup.model.NoteGroups;
import com.wispnote.analyzer.application.notegroup.port.NoteGroupPort;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationActionExecutionResult;
import com.wispnote.analyzer.application.noteautomationrun.model.RunnableAutomation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class AddNoteToGroupActionExecutor implements NoteAutomationActionExecutor {
    private final NoteGroupPort noteGroupPort;

    @Override
    public NoteAutomationActionExecutionResult execute(RunnableAutomation automation, Note note, NoteGroups noteGroups) {
        var group = noteGroups.findByIdOrTitle(automation.requiredGroupId(), automation.requiredGroupTitle());
        if (group.isEmpty()) {
            log.info("Note group does not exist, skipping {} {} {}",
                    kv("automationId", automation.automationId()),
                    kv("noteId", note.id()),
                    kv("requiredGroupTitle", automation.requiredGroupTitle()));
            return NoteAutomationActionExecutionResult.skipped(
                    automation.automationId(),
                    "Note group " + automation.requiredGroupTitle() + " does not exist");
        }

        noteGroupPort.addNote(note.memberId(), group.get().id(), note.id());
        log.info("Note added to note group {} {} {}",
                kv("automationId", automation.automationId()),
                kv("noteId", note.id()),
                kv("noteGroupId", group.get().id()));
        return NoteAutomationActionExecutionResult.addedToGroup(automation.automationId(), group.get().id());
    }

    @Override
    public AutomationActionType getActionType() {
        return AutomationActionType.ADD_NOTE_TO_GROUP;
    }
}
