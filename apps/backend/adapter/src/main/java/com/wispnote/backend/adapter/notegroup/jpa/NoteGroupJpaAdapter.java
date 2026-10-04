package com.wispnote.backend.adapter.notegroup.jpa;

import com.wispnote.backend.adapter.common.exception.EntityNotFoundException;
import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity_;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupEntity;
import com.wispnote.backend.adapter.notegroup.jpa.entity.NoteGroupNoteEntity;
import com.wispnote.backend.adapter.notegroup.jpa.projection.NoteGroupNoteCountProjection;
import com.wispnote.backend.adapter.notegroup.jpa.repository.NoteGroupNoteRepository;
import com.wispnote.backend.adapter.notegroup.jpa.repository.NoteGroupRepository;
import com.wispnote.backend.application.notegroup.model.NoteGroup;
import com.wispnote.backend.application.notegroup.model.NoteGroupFilter;
import com.wispnote.backend.application.notegroup.model.NoteGroupSummary;
import com.wispnote.backend.application.notegroup.port.NoteGroupPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static com.wispnote.backend.adapter.common.jpa.specification.CommonSpecification.isNotDeleted;
import static com.wispnote.backend.adapter.notegroup.jpa.specification.NoteGroupSpecification.belongsToMember;
import static com.wispnote.backend.adapter.notegroup.jpa.specification.NoteGroupSpecification.titleOrDescriptionLike;
import static java.util.stream.Collectors.toMap;
import static org.springframework.data.domain.Sort.Direction.DESC;

@Component
@RequiredArgsConstructor
public class NoteGroupJpaAdapter implements NoteGroupPort {

    private final NoteGroupRepository noteGroupRepository;
    private final NoteGroupNoteRepository noteGroupNoteRepository;

    @Override
    public NoteGroup create(NoteGroup noteGroup) {
        var entity = new NoteGroupEntity();
        entity.setMemberId(noteGroup.memberId());
        entity.setTitle(noteGroup.title());
        entity.setDescription(noteGroup.description());

        return noteGroupRepository.save(entity).toModel();
    }

    @Override
    public Optional<NoteGroupSummary> findByIdAndMemberId(UUID id, UUID memberId) {
        return noteGroupRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                .map(entity -> entity.toSummary(
                        noteGroupNoteRepository.countActiveNotesByNoteGroupId(entity.getId())));
    }

    @Override
    public boolean existsByIdAndMemberId(UUID id, UUID memberId) {
        return noteGroupRepository.existsByIdAndMemberIdAndDeletedFalse(id, memberId);
    }

    @Override
    public List<NoteGroupSummary> findAllByMemberId(UUID memberId, NoteGroupFilter filter) {
        var noteGroupEntities = findNoteGroupEntities(memberId, filter);
        var noteCounts = findNoteCounts(noteGroupEntities);

        return noteGroupEntities.stream()
                .map(entity -> entity.toSummary(noteCounts.getOrDefault(entity.getId(), 0L)))
                .toList();
    }

    @Override
    public void deleteByIdAndMemberId(UUID id, UUID memberId) {
        var entity = noteGroupRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                .orElseThrow(EntityNotFoundException::new);
        entity.setDeleted(true);
        noteGroupRepository.save(entity);
    }

    @Override
    public boolean existsNoteInGroup(UUID noteGroupId, UUID noteId) {
        return noteGroupNoteRepository.existsByNoteGroupIdAndNoteIdAndDeletedFalse(noteGroupId, noteId);
    }

    @Override
    public void addNoteToGroup(UUID noteGroupId, UUID noteId) {
        var entity = new NoteGroupNoteEntity();
        entity.setNoteGroupId(noteGroupId);
        entity.setNoteId(noteId);

        noteGroupNoteRepository.save(entity);
    }

    @Override
    public void removeNoteFromGroup(UUID noteGroupId, UUID noteId) {
        noteGroupNoteRepository.softDeleteByNoteGroupIdAndNoteId(noteGroupId, noteId);
    }

    private List<NoteGroupEntity> findNoteGroupEntities(UUID memberId, NoteGroupFilter filter) {
        return noteGroupRepository.findAll(
                belongsToMember(memberId)
                        .and(titleOrDescriptionLike(filter.search()))
                        .and(isNotDeleted()),
                Sort.by(DESC, BaseEntity_.CREATED_AT));
    }

    private Map<UUID, Long> findNoteCounts(List<NoteGroupEntity> noteGroupEntities) {
        if (noteGroupEntities.isEmpty()) {
            return Map.of();
        }

        var noteGroupIds = noteGroupEntities.stream()
                .map(NoteGroupEntity::getId)
                .toList();

        return noteGroupNoteRepository.countActiveNotesByNoteGroupIds(noteGroupIds)
                .stream()
                .collect(toMap(NoteGroupNoteCountProjection::getNoteGroupId,
                        NoteGroupNoteCountProjection::getNoteCount));
    }

}
