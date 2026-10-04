package com.wispnote.backend.adapter.automation.rest.response;

import com.wispnote.backend.application.automation.model.AutomationPage;

import java.util.List;

public record AutomationPageResponse(Integer page,
                                     Integer size,
                                     Integer totalPages,
                                     Integer totalElements,
                                     Boolean isLastPage,
                                     Long activeCount,
                                     List<AutomationResponse> content) {

    public static AutomationPageResponse from(AutomationPage automationPage) {
        var paginated = automationPage.page();

        return new AutomationPageResponse(paginated.getPage(),
                paginated.getSize(),
                paginated.getTotalPages(),
                paginated.getTotalElements(),
                paginated.getIsLastPage(),
                automationPage.activeCount(),
                paginated.getContent().stream().map(AutomationResponse::from).toList());
    }
}
