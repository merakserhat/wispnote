package com.wispnote.analyzer.application.noteautomationrun.service;

import com.wispnote.analyzer.application.note.model.Note;
import com.wispnote.analyzer.application.noteautomationrun.executor.NoteAutomationActionExecutorFactory;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationActionExecutionResult;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchRequest;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRun;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationRunItem;
import com.wispnote.analyzer.application.noteautomationrun.model.RunnableAutomation;
import com.wispnote.analyzer.application.noteautomationrun.port.NoteAutomationMatchPort;
import com.wispnote.analyzer.application.noteautomationrun.port.NoteAutomationRunPersistencePort;
import com.wispnote.analyzer.application.notegroup.model.NoteGroups;
import com.wispnote.analyzer.application.notegroup.port.NoteGroupPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteAutomationRunHandlerService {
    private static final String NOT_RUNNABLE_DETAILS = "Automation is no longer runnable";
    private static final String MATCH_FAILED_DETAILS = "Automation could not be checked for this note";
    private static final String ACTION_FAILED_DETAILS = "Automation matched but its action could not be completed";

    private final NoteAutomationMatchPort noteAutomationMatchPort;
    private final NoteAutomationActionExecutorFactory actionExecutorFactory;
    private final NoteAutomationRunPersistencePort noteAutomationRunPersistencePort;
    private final NoteGroupPort noteGroupPort;

    public void handle(NoteAutomationRun noteAutomationRun, Note note, List<RunnableAutomation> automations) {
        var matchedRun = match(noteAutomationRun, note, automations);
        var executedRun = execute(matchedRun, note, automations);
        log.info("Note automation run completed {} {} {}",
                kv("noteAutomationRunId", executedRun.id()),
                kv("noteId", executedRun.noteId()),
                kv("status", executedRun.status()));
    }

    private NoteAutomationRun match(NoteAutomationRun noteAutomationRun, Note note, List<RunnableAutomation> automations) {
        if (noteAutomationRun.itemsWaitingForMatch().isEmpty()) {
            return noteAutomationRun;
        }
        NoteAutomationRun matchedRun;
        try {
            var matchResult = noteAutomationMatchPort.match(new NoteAutomationMatchRequest(note, automations));
            matchedRun = noteAutomationRun.applyMatches(matchResult);
        } catch (Exception exception) {
            log.error("Note automation matching failed {} {}",
                    kv("noteAutomationRunId", noteAutomationRun.id()),
                    kv("noteId", note.id()),
                    exception);
            matchedRun = noteAutomationRun.failMatching(MATCH_FAILED_DETAILS);
        }
        return noteAutomationRunPersistencePort.update(matchedRun);
    }

    private NoteAutomationRun execute(NoteAutomationRun noteAutomationRun, Note note, List<RunnableAutomation> automations) {
        if (noteAutomationRun.itemsWaitingForAction().isEmpty()) {
            return noteAutomationRun;
        }

        var noteGroups = noteGroupPort.findAllByMemberId(note.memberId());
        Map<UUID, RunnableAutomation> automationsById = automations.stream()
                .collect(Collectors.toMap(RunnableAutomation::automationId, Function.identity()));

        for (var item : noteAutomationRun.itemsWaitingForAction()) {
            var automation = automationsById.get(item.automationId());
            var executedRun = executeItem(noteAutomationRun, item, automation, note, noteGroups);
            noteAutomationRun = noteAutomationRunPersistencePort.update(executedRun);
        }

        return noteAutomationRun;
    }

    private NoteAutomationRun executeItem(NoteAutomationRun noteAutomationRun,
                                          NoteAutomationRunItem item,
                                          RunnableAutomation automation,
                                          Note note,
                                          NoteGroups noteGroups) {
        if (automation == null) {
            var skipped = NoteAutomationActionExecutionResult.skipped(item.automationId(), NOT_RUNNABLE_DETAILS);
            return noteAutomationRun.apply(skipped);
        }

        try {
            var executor = actionExecutorFactory.getExecutor(item.actionType());
            var executionResult = executor.execute(automation, note, noteGroups);
            return noteAutomationRun.apply(executionResult);
        } catch (Exception exception) {
            log.error("Note automation action failed {} {} {}",
                    kv("noteAutomationRunId", noteAutomationRun.id()),
                    kv("automationId", item.automationId()),
                    kv("actionType", item.actionType()),
                    exception);
            return noteAutomationRun.fail(item.automationId(), ACTION_FAILED_DETAILS);
        }
    }
}
