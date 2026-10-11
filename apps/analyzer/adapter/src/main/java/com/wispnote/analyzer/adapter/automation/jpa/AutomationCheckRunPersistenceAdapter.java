package com.wispnote.analyzer.adapter.automation.jpa;

import com.wispnote.analyzer.adapter.automation.jpa.entity.AutomationCheckRunEntity;
import com.wispnote.analyzer.adapter.automation.jpa.entity.AutomationCheckRunItemEntity;
import com.wispnote.analyzer.adapter.automation.jpa.repository.AutomationCheckRunItemRepository;
import com.wispnote.analyzer.adapter.automation.jpa.repository.AutomationCheckRunRepository;
import com.wispnote.analyzer.application.automation.exception.AutomationCheckRunAlreadyExistsException;
import com.wispnote.analyzer.application.automation.exception.AutomationCheckRunConflictException;
import com.wispnote.analyzer.application.automation.exception.AutomationCheckRunNotFoundException;
import com.wispnote.analyzer.application.automation.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automation.model.AutomationCheckRunItem;
import com.wispnote.analyzer.application.automation.port.AutomationCheckRunPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Component;

import java.time.Instant;
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
    public AutomationCheckRun create(UUID automationId, UUID memberId, int fingerprintValue) {
        log.info("Creating automation check run by {} {} {} ",
                kv("automationId", automationId),
                kv("memberId", memberId),
                kv("fingerprintValue", fingerprintValue));

        var automationCheckRunEntity = new AutomationCheckRunEntity();
        automationCheckRunEntity.setAutomationId(automationId);
        automationCheckRunEntity.setMemberId(memberId);
        automationCheckRunEntity.setFingerprint(fingerprintValue);
        return automationCheckRunRepository.save(automationCheckRunEntity).toModel(Set.of());
    }

    @Override
    public Optional<AutomationCheckRun> findByAutomationId(UUID automationId) {
        log.info("Retrieving automation check run by {}", kv("automationId", automationId));
        var checkRunOptional = automationCheckRunRepository.findByAutomationId(automationId);

        if (checkRunOptional.isEmpty()) {
            return Optional.empty();
        }

        var checkRun = checkRunOptional.get();
        var checkRunItems = automationCheckRunItemRepository.findAllByAutomationCheckRunIdAndDeletedFalse(automationId);

        return Optional.of(checkRun.toModel(checkRunItems));
    }
}
