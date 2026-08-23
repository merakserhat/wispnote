package com.wispnote.analyzer.adapter.note.rabbit.message;

import com.wispnote.analyzer.adapter.note.converter.SourceKindConverter;
import com.wispnote.analyzer.application.note.model.Source;

public record SourcePayload(Long id,
                            String kind,
                            String key,
                            String title,
                            String url,
                            String filePath) {

    public Source toModel() {
        return new Source(
                id,
                SourceKindConverter.rabbit.toEnum(kind),
                key,
                title,
                url,
                filePath
        );
    }
}
