package com.wispnote.analyzer.adapter.automationcheckrun.internalrest;

import com.wispnote.analyzer.adapter.automationcheckrun.internalrest.response.InternalAutomationCheckRunResponse;
import com.wispnote.analyzer.application.automationcheckrun.AutomationCheckRunFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal/v1")
public class InternalAutomationCheckRunController {

    private final AutomationCheckRunFacade automationCheckRunFacade;

    @GetMapping("/members/{memberId}/automation-check-runs")
    public List<InternalAutomationCheckRunResponse> listByAutomationIds(@PathVariable UUID memberId,
                                                                         @RequestParam List<UUID> automationIds) {
        return automationCheckRunFacade.listByAutomationIds(memberId, automationIds).stream()
                .map(InternalAutomationCheckRunResponse::from)
                .toList();
    }
}
