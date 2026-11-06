package com.wispnote.backend.application.automation.model;

import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.backend.application.common.model.Paginated;

import java.util.List;

public record AutomationPage(Paginated<Automation> page, long activeCount, List<AutomationCheckRun> checkRuns) {
}
