package com.wispnote.backend.application.automation;

import com.wispnote.backend.application.automation.exception.AutomationNotFoundBusinessException;
import com.wispnote.backend.application.automation.model.Automation;
import com.wispnote.backend.application.automation.model.AutomationCreate;
import com.wispnote.backend.application.automation.model.AutomationFilter;
import com.wispnote.backend.application.automation.model.AutomationPage;
import com.wispnote.backend.application.automation.model.AutomationSuggestion;
import com.wispnote.backend.application.automation.model.AutomationUpdate;
import com.wispnote.backend.application.automation.port.AutomationPort;
import com.wispnote.backend.application.automation.port.AutomationSuggestionPort;
import com.wispnote.backend.application.common.model.PaginationInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationFacade {

    private static final int MAX_SUGGESTIONS = 3;

    private final AutomationPort automationPort;
    private final AutomationSuggestionPort automationSuggestionPort;

    public Automation create(UUID memberId, AutomationCreate create) {
        return automationPort.create(create.toAutomation(memberId));
    }

    public AutomationPage list(UUID memberId, AutomationFilter filter, PaginationInfo paginationInfo) {
        var page = automationPort.findAllByMemberId(memberId, filter, paginationInfo);

        return new AutomationPage(page, automationPort.countEnabledByMemberId(memberId));
    }

    public List<AutomationSuggestion> suggestions(UUID memberId) {
        if (automationPort.existsByMemberId(memberId)) {
            return List.of();
        }

        return automationSuggestionPort.findAll(MAX_SUGGESTIONS);
    }

    public Automation retrieve(UUID memberId, UUID automationId) {
        return automationPort.findByIdAndMemberId(automationId, memberId)
                .orElseThrow(AutomationNotFoundBusinessException::new);
    }

    public Automation update(UUID memberId, UUID automationId, AutomationUpdate update) {
        var current = retrieve(memberId, automationId);

        var ruleText = update.ruleText() != null ? update.ruleText() : current.ruleText();
        var enabled = update.enabled() != null ? update.enabled() : current.enabled();

        log.info("Automation is being updated {} {}", kv("memberId", memberId), kv("automationId", automationId));
        return automationPort.update(new Automation(current.id(),
                current.memberId(),
                ruleText,
                enabled,
                current.createdAt(),
                current.updatedAt()));
    }

    public void delete(UUID memberId, UUID automationId) {
        retrieve(memberId, automationId);

        log.info("Automation is being deleted {} {}", kv("memberId", memberId), kv("automationId", automationId));
        automationPort.deleteByIdAndMemberId(automationId, memberId);
    }
}
