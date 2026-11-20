package com.wispnote.analyzer.application.noteautomationrun.executor;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationActionExecutionResult;
import com.wispnote.analyzer.application.noteautomationrun.model.RunnableAutomation;
import com.wispnote.analyzer.application.notegroup.model.NoteGroups;

public interface NoteAutomationActionExecutor {

    NoteAutomationActionExecutionResult execute(RunnableAutomation automation, Note note, NoteGroups noteGroups);

    AutomationActionType getActionType();
}
