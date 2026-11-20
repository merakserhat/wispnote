package com.wispnote.analyzer.adapter.noteautomationrun.jpa;

import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationActionTypeConverter;
import com.wispnote.analyzer.adapter.noteautomationrun.converter.NoteAutomationRunItemOutcomeConverter;
import com.wispnote.analyzer.adapter.noteautomationrun.converter.NoteAutomationRunItemStatusConverter;
import com.wispnote.analyzer.adapter.noteautomationrun.jpa.entity.NoteAutomationRunEntity;
import com.wispnote.analyzer.adapter.noteautomationrun.jpa.entity.NoteAutomationRunItemEntity;
import com.wispnote.analyzer.adapter.noteautomationrun.jpa.repository.NoteAutomationRunItemRepository;
import com.wispnote.analyzer.adapter.noteautomationrun.jpa.repository.NoteAutomationRunRepository;
import com.wispnote.analyzer.application.noteautomationrun.exception.NoteAutomationRunConflictException;
import com.wispnote.analyzer.application.noteautomationrun.exception.NoteAutomationRunNotFoundException;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRun;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItem;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItems;
import com.wispnote.analyzer.application.noteautomationrun.port.NoteAutomationRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class NoteAutomationRunPersistenceAdapter implements NoteAutomationRunPersistencePort {
    private final NoteAutomationRunRepository noteAutomationRunRepository;
    private final NoteAutomationRunItemRepository noteAutomationRunItemRepository;

    @Override
    @Transactional
    public NoteAutomationRun create(UUID noteId, UUID memberId, NoteAutomationRunItems items) {
        log.info("Creating note automation run by {} {} {}",
                kv("noteId", noteId),
                kv("memberId", memberId),
                kv("itemCount", items.values().size()));
        var runEntity = new NoteAutomationRunEntity();
        runEntity.setNoteId(noteId);
        runEntity.setMemberId(memberId);
        var savedRunEntity = noteAutomationRunRepository.saveAndFlush(runEntity);
        var itemEntities = saveItems(savedRunEntity, items);
        return savedRunEntity.toModel(itemEntities);
    }

    @Override
    @Transactional
    public NoteAutomationRun update(NoteAutomationRun noteAutomationRun) {
        log.info("Updating note automation run by {} {}",
                kv("noteAutomationRunId", noteAutomationRun.id()),
                kv("status", noteAutomationRun.status()));
        var runEntity = noteAutomationRunRepository.findById(noteAutomationRun.id())
                .orElseThrow(NoteAutomationRunNotFoundException::new);
        validateVersion(runEntity, noteAutomationRun);
        var itemEntities = saveItems(runEntity, noteAutomationRun.items());
        runEntity.setUpdatedAt(Instant.now());
        return noteAutomationRunRepository.saveAndFlush(runEntity).toModel(itemEntities);
    }

    @Override
    public Optional<NoteAutomationRun> findByNoteId(UUID noteId) {
        log.info("Retrieving note automation run by {}", kv("noteId", noteId));
        var runOptional = noteAutomationRunRepository.findByNoteId(noteId);
        if (runOptional.isEmpty()) {
            return Optional.empty();
        }
        var runEntity = runOptional.get();
        var itemEntities = noteAutomationRunItemRepository.findAllByNoteAutomationRunIdAndDeletedFalse(runEntity.getId());
        return Optional.of(runEntity.toModel(itemEntities));
    }

    private void validateVersion(NoteAutomationRunEntity runEntity, NoteAutomationRun noteAutomationRun) {
        if (runEntity.getVersion().equals(noteAutomationRun.version())) {
            return;
        }
        log.warn("Note automation run was modified concurrently {} {} {}",
                kv("noteAutomationRunId", noteAutomationRun.id()),
                kv("expectedVersion", noteAutomationRun.version()),
                kv("actualVersion", runEntity.getVersion()));
        throw new NoteAutomationRunConflictException();
    }

    private List<NoteAutomationRunItemEntity> saveItems(NoteAutomationRunEntity runEntity, NoteAutomationRunItems items) {
        var existingItemEntitiesById = noteAutomationRunItemRepository
                .findAllByNoteAutomationRunIdAndDeletedFalse(runEntity.getId())
                .stream()
                .collect(Collectors.toMap(NoteAutomationRunItemEntity::getId, Function.identity()));
        var itemEntities = new ArrayList<NoteAutomationRunItemEntity>();
        for (var item : items.values()) {
            var itemEntity = existingItemEntitiesById.get(item.id());
            if (itemEntity == null) {
                itemEntity = new NoteAutomationRunItemEntity();
                itemEntity.setRun(runEntity);
            }
            applyItem(itemEntity, item);
            itemEntities.add(itemEntity);
        }
        return noteAutomationRunItemRepository.saveAllAndFlush(itemEntities);
    }

    private void applyItem(NoteAutomationRunItemEntity itemEntity, NoteAutomationRunItem item) {
        itemEntity.setAutomationId(item.automationId());
        itemEntity.setActionType(AutomationActionTypeConverter.entity.fromEnum(item.actionType()));
        itemEntity.setStatus(NoteAutomationRunItemStatusConverter.entity.fromEnum(item.status()));
        itemEntity.setOutcome(NoteAutomationRunItemOutcomeConverter.entity.fromEnum(item.outcome()));
        itemEntity.setConfidence(item.confidence());
        itemEntity.setDetails(item.details());
        itemEntity.setNoteGroupId(item.noteGroupId());
    }
}
