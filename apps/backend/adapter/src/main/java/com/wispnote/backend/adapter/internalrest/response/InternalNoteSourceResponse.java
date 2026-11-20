package com.wispnote.backend.adapter.internalrest.response;

import com.wispnote.backend.application.source.enums.SourceKind;
import com.wispnote.backend.application.source.model.Source;

public record InternalNoteSourceResponse(SourceKind kind,
                                         String title,
                                         String url,
                                         String appName) {
    public static InternalNoteSourceResponse from(Source source) {
        return new InternalNoteSourceResponse(source.kind(),
                source.title(),
                source.url(),
                source.appName());
    }
}
