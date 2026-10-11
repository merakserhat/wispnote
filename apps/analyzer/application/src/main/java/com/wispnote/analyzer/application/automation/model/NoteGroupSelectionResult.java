package com.wispnote.analyzer.application.automation.model;

public record NoteGroupSelectionResult(String groupTitle,
                                       boolean existing,
                                       Integer confidence,
                                       String details) {
}
