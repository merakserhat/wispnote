package com.wispnote.backend.adapter.automation.rest.response;

import com.wispnote.backend.application.automation.model.AutomationPage;
import com.wispnote.backend.application.automationcheckrun.model.AutomationCheckRun;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public record AutomationPageResponse(Integer page,
                                     Integer size,
                                     Integer totalPages,
                                     Integer totalElements,
                                     Boolean isLastPage,
                                     Long activeCount,
                                     List<AutomationResponse> content) {

    public static AutomationPageResponse from(AutomationPage automationPage) {
        var paginated = automationPage.page();
        var checkRunsByAutomationId = automationPage.checkRuns().stream()
                .collect(Collectors.toMap(AutomationCheckRun::automationId, Function.identity(), (first, second) -> first));
        var content = paginated.getContent().stream()
                .map(automation -> AutomationResponse.from(automation, checkRunsByAutomationId.get(automation.id())))
                .toList();

        return new AutomationPageResponse(paginated.getPage(),
                paginated.getSize(),
                paginated.getTotalPages(),
                paginated.getTotalElements(),
                paginated.getIsLastPage(),
                automationPage.activeCount(),
                content);
    }
}
