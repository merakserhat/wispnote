package com.wispnote.backend.adapter.note.jpa;

import com.wispnote.backend.adapter.note.converter.SourceKindConverter;
import com.wispnote.backend.adapter.note.jpa.entity.SourceEntity;
import com.wispnote.backend.adapter.note.jpa.repository.SourceRepository;
import com.wispnote.backend.application.note.model.Source;
import com.wispnote.backend.application.note.model.SourceCapture;
import com.wispnote.backend.application.note.port.SourcePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SourceJpaAdapter implements SourcePort {

    private final SourceRepository sourceRepository;

    @Override
    public Source upsertByMemberIdAndKey(UUID memberId, String key, SourceCapture capture) {
        var entity = sourceRepository.findByMemberIdAndKeyAndDeletedFalse(memberId, key)
                .orElseGet(SourceEntity::new);

        entity.setMemberId(memberId);
        entity.setKey(key);
        entity.setKind(SourceKindConverter.jpa.fromEnum(capture.kind()));
        entity.setTitle(capture.title() == null ? "" : capture.title());
        entity.setUrl(capture.url());
        entity.setFilePath(capture.filePath());
        entity.setAppName(capture.appName());
        entity.setBundleId(capture.bundleId());
        entity.setMetadata(capture.metadata() == null ? new HashMap<>() : capture.metadata());

        return sourceRepository.save(entity).toModel();
    }
}
