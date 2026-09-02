package com.wispnote.backend.application.note.port;

import com.wispnote.backend.application.note.model.Source;
import com.wispnote.backend.application.note.model.SourceCapture;

import java.util.UUID;

public interface SourcePort {
    Source upsertByMemberIdAndKey(UUID memberId, String key, SourceCapture capture);
}
