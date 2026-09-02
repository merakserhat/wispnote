package com.wispnote.backend.adapter.note.rest.request;

import com.wispnote.backend.application.note.enums.SourceKind;
import com.wispnote.backend.application.note.model.SourceCapture;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class SourceCaptureRequest {

    @NotNull(message = "{validations.note.source.kind.empty}")
    private SourceKind kind;

    private String title;
    private String url;
    private String filePath;
    private String appName;
    private String bundleId;
    private String documentId;
    private Map<String, Object> metadata;

    public SourceCapture toModel() {
        return new SourceCapture(kind, title, url, filePath, appName, bundleId, documentId, metadata);
    }
}
