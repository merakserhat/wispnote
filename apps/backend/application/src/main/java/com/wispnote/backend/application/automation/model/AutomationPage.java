package com.wispnote.backend.application.automation.model;

import com.wispnote.backend.application.common.model.Paginated;

public record AutomationPage(Paginated<Automation> page, long activeCount) {
}
