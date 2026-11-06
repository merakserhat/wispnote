package com.wispnote.analyzer.application.automationcheckrun.port;

import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationCheckRunAlreadyExistsException;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationCheckRunConflictException;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationCheckRunNotFoundException;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationFingerprint;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AutomationCheckRunPersistencePort {
    AutomationCheckRun create(UUID automationId, UUID memberId, AutomationFingerprint automationFingerprint);

    AutomationCheckRun update(AutomationCheckRun automationCheckRun);

    Optional<AutomationCheckRun> findByAutomationId(UUID automationId);

    List<AutomationCheckRun> findAllByMemberIdAndAutomationIds(UUID memberId, List<UUID> automationIds);
}
