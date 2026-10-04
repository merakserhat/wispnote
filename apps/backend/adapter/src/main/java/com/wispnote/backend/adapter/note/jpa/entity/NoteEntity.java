package com.wispnote.backend.adapter.note.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.backend.adapter.note.converter.EnrichmentStatusConverter;
import com.wispnote.backend.adapter.note.converter.NoteKindConverter;
import com.wispnote.backend.application.note.enums.EnrichmentStatus;
import com.wispnote.backend.application.note.enums.NoteKind;
import com.wispnote.backend.application.note.model.Note;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "note")
public class NoteEntity extends BaseEntity {

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false)
    private UUID sourceId;

    @Column(nullable = false)
    private String kind = NoteKindConverter.jpa.fromEnum(NoteKind.HIGHLIGHT);

    @Column(nullable = false)
    private String selectedText = "";

    @Column(nullable = false)
    private String userNote = "";

    @Column(nullable = false)
    private String contextBefore = "";

    @Column(nullable = false)
    private String contextAfter = "";

    private String section;

    private Integer pageNumber;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> location = new HashMap<>();

    private String windowTitle;

    @Column(nullable = false)
    private String enrichmentStatus = EnrichmentStatusConverter.jpa.fromEnum(EnrichmentStatus.PENDING);

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> rawCapture = new HashMap<>();

    public Note toModel() {
        return new Note(getId(),
                memberId,
                sourceId,
                NoteKindConverter.jpa.toEnum(kind),
                selectedText,
                userNote,
                contextBefore,
                contextAfter,
                section,
                pageNumber,
                location,
                windowTitle,
                EnrichmentStatusConverter.jpa.toEnum(enrichmentStatus),
                rawCapture,
                getCreatedAt());
    }
}
