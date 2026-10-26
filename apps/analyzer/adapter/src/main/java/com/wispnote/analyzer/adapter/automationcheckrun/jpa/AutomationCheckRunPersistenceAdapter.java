package com.wispnote.analyzer.adapter.automationcheckrun.jpa;

import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationActionTypeConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunItemOutcomeConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunItemStatusConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.converter.AutomationCheckRunStageConverter;
import com.wispnote.analyzer.adapter.automationcheckrun.jpa.entity.AutomationCheckRunEntity;
import com.wispnote.analyzer.adapter.automationcheckrun.jpa.entity.AutomationCheckRunItemEntity;
import com.wispnote.analyzer.adapter.automationcheckrun.jpa.repository.AutomationCheckRunItemRepository;
import com.wispnote.analyzer.adapter.automationcheckrun.jpa.repository.AutomationCheckRunRepository;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationCheckRunConflictException;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationCheckRunNotFoundException;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationFingerprint;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationCheckRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class AutomationCheckRunPersistenceAdapter implements AutomationCheckRunPersistencePort {

    private final AutomationCheckRunRepository automationCheckRunRepository;
    private final AutomationCheckRunItemRepository automationCheckRunItemRepository;

    @Override
    public AutomationCheckRun create(UUID automationId, UUID memberId, AutomationFingerprint automationFingerprint) {
        log.info("Creating automation check run by {} {} {} ",
                kv("automationId", automationId),
                kv("memberId", memberId),
                kv("fingerprintValue", automationFingerprint.value()));

        var automationCheckRunEntity = new AutomationCheckRunEntity();
        automationCheckRunEntity.setAutomationId(automationId);
        automationCheckRunEntity.setMemberId(memberId);
        automationCheckRunEntity.setFingerprint(automationFingerprint.value());
        return automationCheckRunRepository.save(automationCheckRunEntity).toModel(Set.of());
    }

    @Override
    @Transactional
    public AutomationCheckRun update(AutomationCheckRun automationCheckRun) {
        log.info("Updating automation check run by {} {}",
                kv("automationCheckRunId", automationCheckRun.id()),
                kv("fingerprintValue", automationCheckRun.fingerprint().value()));

        var checkRunEntity = automationCheckRunRepository.findById(automationCheckRun.id())
                .orElseThrow(AutomationCheckRunNotFoundException::new);

        var updatedItemEntities = updateItems(checkRunEntity, automationCheckRun);
        checkRunEntity.setFingerprint(automationCheckRun.fingerprint().value());
        checkRunEntity.setConfidence(automationCheckRun.confidence());

        return automationCheckRunRepository.save(checkRunEntity).toModel(updatedItemEntities);
    }

    @Override
    public Optional<AutomationCheckRun> findByAutomationId(UUID automationId) {
        log.info("Retrieving automation check run by {}", kv("automationId", automationId));
        var checkRunOptional = automationCheckRunRepository.findByAutomationId(automationId);

        if (checkRunOptional.isEmpty()) {
            return Optional.empty();
        }

        var checkRun = checkRunOptional.get();
        var checkRunItems = automationCheckRunItemRepository.findAllByAutomationCheckRunIdAndDeletedFalse(checkRun.getId());

        return Optional.of(checkRun.toModel(checkRunItems));
    }

    private Set<AutomationCheckRunItemEntity> updateItems(AutomationCheckRunEntity checkRunEntity,
                                                          AutomationCheckRun automationCheckRun) {
        var itemEntitiesById = automationCheckRunItemRepository
                .findAllByAutomationCheckRunIdAndDeletedFalse(checkRunEntity.getId())
                .stream()
                .collect(Collectors.toMap(AutomationCheckRunItemEntity::getId, Function.identity()));

        var itemEntities = new ArrayList<AutomationCheckRunItemEntity>();

        for (var item : automationCheckRun.items().values()) {
            AutomationCheckRunItemEntity itemEntity;

            if (item.id() == null) {
                itemEntity = new AutomationCheckRunItemEntity();
                itemEntity.setRun(checkRunEntity);
            } else {
                itemEntity = itemEntitiesById.get(item.id());

                if (itemEntity == null) {
                    log.error("Automation check run item not found {}", kv("automationCheckRunItemId", item.id()));
                    throw new AutomationCheckRunNotFoundException();
                }

                if (!itemEntity.getVersion().equals(item.version())) {
                    log.warn("Automation check run item was modified concurrently {} {} {}",
                            kv("automationCheckRunItemId", item.id()),
                            kv("expectedVersion", item.version()),
                            kv("actualVersion", itemEntity.getVersion()));
                    throw new AutomationCheckRunConflictException();
                }
            }

            itemEntity.setStage(AutomationCheckRunStageConverter.entity.fromEnum(item.stage()));
            itemEntity.setStatus(AutomationCheckRunItemStatusConverter.entity.fromEnum(item.status()));
            itemEntity.setOutcome(AutomationCheckRunItemOutcomeConverter.entity.fromEnum(item.result().outcome()));
            itemEntity.setConfidence(item.result().confidence());
            itemEntity.setDetails(item.result().details());
            itemEntity.setDecidedActionType(AutomationActionTypeConverter.entity.fromEnum(item.decidedActionType()));
            itemEntity.setCondition(item.condition());
            itemEntity.setRequiredGroupTitle(item.requiredGroupTitle());
            itemEntities.add(itemEntity);
        }

        return new LinkedHashSet<>(automationCheckRunItemRepository.saveAll(itemEntities));
    }
}
