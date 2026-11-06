package com.wispnote.backend.application.automationcheckrun.port;

import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;

import java.util.List;
import java.util.UUID;

public interface AutomationCheckRunPort {
    List<AutomationCheckRun> findAllByMemberIdAndAutomationIds(UUID memberId, List<UUID> automationIds);
}
