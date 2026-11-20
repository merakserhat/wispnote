package com.wispnote.analyzer.adapter.noteautomationmatch.mock;

import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatch;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchRequest;
import com.wispnote.analyzer.application.noteautomationrun.model.NoteAutomationMatchResult;
import com.wispnote.analyzer.application.noteautomationrun.port.NoteAutomationMatchPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "mock")
public class MockNoteAutomationMatchAdapter implements NoteAutomationMatchPort {

    @Override
    public NoteAutomationMatchResult match(NoteAutomationMatchRequest request) {
        log.info("MOCK - Matching note against automations. {}, {}",
                kv("noteId", request.note().id()),
                kv("automationCount", request.automations().size()));
        var matches = request.automations().stream()
                .map(automation -> new NoteAutomationMatch(automation.automationId(), true, 100, "Mock: the note matches the rule."))
                .toList();
        return new NoteAutomationMatchResult(matches);
    }
}
