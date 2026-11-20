package com.wispnote.analyzer.application.noteautomationrun.port;

import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchRequest;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchResult;

public interface NoteAutomationMatchPort {

    NoteAutomationMatchResult match(NoteAutomationMatchRequest request);
}
