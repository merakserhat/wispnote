package com.wispnote.analyzer.application.note.model;

public record NoteSource(String kind,
                         String title,
                         String url,
                         String appName) {
}
