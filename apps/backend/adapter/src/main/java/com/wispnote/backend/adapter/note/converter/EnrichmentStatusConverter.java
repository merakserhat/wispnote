package com.wispnote.backend.adapter.note.converter;

import com.wispnote.backend.adapter.common.converter.BaseEnumConverter;
import com.wispnote.backend.application.note.enums.EnrichmentStatus;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class EnrichmentStatusConverter {
    public static final BaseEnumConverter<EnrichmentStatus, String> jpa = new BaseEnumConverter<>(Map.of(
            EnrichmentStatus.PENDING, "pending",
            EnrichmentStatus.ENRICHED, "enriched",
            EnrichmentStatus.FAILED, "failed"
    ));
}
