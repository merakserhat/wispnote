package com.wispnote.backend.adapter.notegroup.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "note_group_note")
public class NoteGroupNoteEntity extends BaseEntity {

    @Column(nullable = false)
    private UUID noteGroupId;

    @Column(nullable = false)
    private UUID noteId;
}
