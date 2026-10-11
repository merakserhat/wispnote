package com.wispnote.analyzer.application.automation.port;

import com.wispnote.analyzer.application.automation.exception.AutomationCheckRunAlreadyExistsException;
import com.wispnote.analyzer.application.automation.exception.AutomationCheckRunConflictException;
import com.wispnote.analyzer.application.automation.exception.AutomationCheckRunNotFoundException;
import com.wispnote.analyzer.application.automation.model.AutomationCheckRun;

import java.util.Optional;
import java.util.UUID;

public interface AutomationCheckRunPersistencePort {
    AutomationCheckRun create(UUID automationId, UUID memberId, int fingerprintValue);

    Optional<AutomationCheckRun> findByAutomationId(UUID automationId);
}
