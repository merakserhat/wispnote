package com.wispnote.analyzer.adapter.notegroupselection.mock;

import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionResult;
import com.wispnote.analyzer.application.automationcheckrun.port.NoteGroupSelectionPort;
import com.wispnote.analyzer.application.notegroup.model.NoteGroup;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "mock")
public class MockNoteGroupSelectionAdapter implements NoteGroupSelectionPort {

    static final String PROPOSED_GROUP_TITLE = "Mock group";

    @Override
    public NoteGroupSelectionResult select(NoteGroupSelectionRequest request) {
        log.info("MOCK - Selecting note group. {}, {}",
                kv("ruleText", request.ruleText()),
                kv("existingGroupCount", request.groups().size()));

        var groupTitle = request.groups().stream()
                .findFirst()
                .map(NoteGroup::title)
                .orElse(PROPOSED_GROUP_TITLE);

        return new NoteGroupSelectionResult(
                "Mock: the note matches the rule.", groupTitle, 100, "Mock: matching notes will be added to " + groupTitle + ".");
    }
}
