package com.wispnote.backend.adapter.internalrest;

import com.wispnote.backend.adapter.internalrest.annotation.InternalRestController;
import com.wispnote.backend.adapter.internalrest.response.InternalAutomationResponse;
import com.wispnote.backend.application.automation.AutomationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@InternalRestController
@RequiredArgsConstructor
@RequestMapping("/internal/v1")
public class InternalAutomationController {

    private final AutomationFacade automationFacade;

    @GetMapping("/members/{memberId}/automations/{automationId}")
    public InternalAutomationResponse retrieveAutomationById(@PathVariable UUID memberId, @PathVariable UUID automationId) {
        return InternalAutomationResponse.from(automationFacade.retrieve(memberId, automationId));
    }
}
