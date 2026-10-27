package com.wispnote.analyzer.application.automationcheckrun.port;

import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionResult;

public interface NoteGroupSelectionPort {

    NoteGroupSelectionResult select(NoteGroupSelectionRequest request);
}
