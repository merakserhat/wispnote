package com.wispnote.analyzer.application.noteautomationrun.model;

import com.wispnote.analyzer.application.note.model.Note;

import java.util.List;

public record NoteAutomationMatchRequest(Note note,
                                         List<RunnableAutomation> automations) {
}
