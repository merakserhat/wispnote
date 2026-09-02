package com.wispnote.backend.adapter.note.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tag")
public class TagEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;
}
