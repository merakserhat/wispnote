package com.wispnote.backend.adapter.note.jpa.repository;

import com.wispnote.backend.adapter.note.jpa.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface TagRepository extends JpaRepository<TagEntity, UUID> {
    List<TagEntity> findByNameInAndDeletedFalse(Collection<String> names);
}
