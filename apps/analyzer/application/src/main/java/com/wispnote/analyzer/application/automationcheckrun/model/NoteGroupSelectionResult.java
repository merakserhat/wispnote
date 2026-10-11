package com.wispnote.analyzer.application.automationcheckrun.model;

public record NoteGroupSelectionResult(String groupTitle,
                                       boolean existing,
                                       Integer confidence,
                                       String details) {
}
