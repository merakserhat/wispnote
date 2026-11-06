package com.wispnote.analyzer.application.automationcheckrun.executor.strategy;

import com.wispnote.analyzer.application.automation.model.Automation;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionEnrichmentExecutionResult;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRun;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationCheckRunItem;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionResult;
import com.wispnote.analyzer.application.automationcheckrun.port.NoteGroupSelectionPort;
import com.wispnote.analyzer.application.notegroup.model.NoteGroup;
import com.wispnote.analyzer.application.notegroup.port.NoteGroupPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

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

        var existingGroup = resolveExistingGroup(groups, result);

        return AutomationActionEnrichmentExecutionResult.passed(
                result.confidence(),
                result.details(),
                result.condition(),
                existingGroup.map(NoteGroup::id).orElse(null),
                existingGroup.map(NoteGroup::title).orElse(result.groupTitle()));
    }

    private Optional<NoteGroup> resolveExistingGroup(List<NoteGroup> groups, NoteGroupSelectionResult result) {
        var byId = groups.stream()
                .filter(group -> group.id().equals(result.groupId()))
                .findFirst();

        if (byId.isPresent()) {
            return byId;
        }

        return groups.stream()
                .filter(group -> group.title().equalsIgnoreCase(result.groupTitle()))
                .findFirst();
    }

    @Override
    public AutomationActionType getActionType() {
        return AutomationActionType.ADD_NOTE_TO_GROUP;
    }
}
