package com.wispnote.analyzer.application.automationcheckrun.executor.strategy;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionEnrichmentExecutionResult;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItem;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.port.NoteGroupSelectionPort;
import com.wispnote.analyzer.application.notegroup.port.NoteGroupPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class AddNoteToGroupEnrichmentStrategy implements AutomationActionEnrichmentStrategy {

    private final NoteGroupPort noteGroupPort;
    private final NoteGroupSelectionPort noteGroupSelectionPort;

    @Override
    public AutomationActionEnrichmentExecutionResult enrich(AutomationCheckRun automationCheckRun, Automation automation) {
        var groups = noteGroupPort.findAllByMemberId(automationCheckRun.memberId());
        var request = new NoteGroupSelectionRequest(automation.ruleText(), groups);
        var result = noteGroupSelectionPort.select(request);

        log.info("Note group selected {} {} {} {}",
                kv("automationCheckRunId", automationCheckRun.id()),
                kv("existingGroupCount", groups.size()),
                kv("groupTitle", result.groupTitle()),
                kv("confidence", result.confidence()));

        if (!result.isComplete() || result.confidence() < AutomationCheckRunItem.MIN_CONFIDENCE) {
            return AutomationActionEnrichmentExecutionResult.rejected(result.confidence(), result.details());
        }

        return AutomationActionEnrichmentExecutionResult.passed(
                result.confidence(), result.details(), result.condition(), result.groupTitle());
    }

    @Override
    public AutomationActionType getActionType() {
        return AutomationActionType.ADD_NOTE_TO_GROUP;
    }
}
