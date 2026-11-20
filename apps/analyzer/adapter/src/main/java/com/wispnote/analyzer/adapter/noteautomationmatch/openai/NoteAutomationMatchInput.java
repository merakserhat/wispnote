package com.wispnote.analyzer.adapter.noteautomationmatch.openai;

import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.note.model.NoteSource;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchRequest;
import com.wispnote.analyzer.application.noteautomationrun.model.RunnableAutomation;

import java.util.List;

public record NoteAutomationMatchInput(NoteInput note, List<Rule> rules) {

    public record NoteInput(String selectedText,
                            String userNote,
                            String contextBefore,
                            String contextAfter,
                            String section,
                            String windowTitle,
                            SourceInput source) {
        static NoteInput from(Note note) {
            return new NoteInput(note.selectedText(),
                    note.userNote(),
                    note.contextBefore(),
                    note.contextAfter(),
                    note.section(),
                    note.windowTitle(),
                    note.source() != null ? SourceInput.from(note.source()) : null);
        }
    }

    public record SourceInput(String kind, String title, String url, String appName) {
        static SourceInput from(NoteSource source) {
            return new SourceInput(source.kind(), source.title(), source.url(), source.appName());
        }
    }

    public record Rule(String id, String condition) {
        static Rule from(RunnableAutomation automation) {
            return new Rule(automation.automationId().toString(), automation.condition());
        }
    }

    public static NoteAutomationMatchInput from(NoteAutomationMatchRequest request) {
        var rules = request.automations().stream()
                .map(Rule::from)
                .toList();
        return new NoteAutomationMatchInput(NoteInput.from(request.note()), rules);
    }
}
