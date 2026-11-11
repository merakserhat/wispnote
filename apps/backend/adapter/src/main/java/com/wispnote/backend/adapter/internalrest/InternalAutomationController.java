package com.wispnote.backend.adapter.internalrest;

import com.wispnote.backend.adapter.internalrest.annotation.InternalRestController;
import com.wispnote.backend.adapter.internalrest.response.InternalAutomationResponse;
import com.wispnote.backend.application.automation.AutomationFacade;
import com.wispnote.backend.application.automation.model.AutomationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

@InternalRestController
@RequiredArgsConstructor
@RequestMapping("/internal/v1")
public class InternalAutomationController {

    private final AutomationFacade automationFacade;

    @GetMapping("/members/{memberId}/automations")
    public List<InternalAutomationResponse> listAutomations(@PathVariable UUID memberId,
                                                            @RequestParam(required = false) Boolean enabled) {
        var automations = automationFacade.listAll(memberId, new AutomationFilter(enabled));
        return automations.stream()
                .map(InternalAutomationResponse::from)
                .toList();
    }

    @GetMapping("/members/{memberId}/automations/{automationId}")
    public InternalAutomationResponse retrieveAutomationById(@PathVariable UUID memberId, @PathVariable UUID automationId) {
        return InternalAutomationResponse.from(automationFacade.retrieve(memberId, automationId));
    }
}
