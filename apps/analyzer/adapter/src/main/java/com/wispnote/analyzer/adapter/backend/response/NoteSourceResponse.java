package com.wispnote.analyzer.adapter.backend.response;

import com.wispnote.analyzer.application.note.model.NoteSource;

public record NoteSourceResponse(String kind,
                                 String title,
                                 String url,
                                 String appName) {
    public NoteSource toModel() {
        return new NoteSource(kind, title, url, appName);
    }
}
