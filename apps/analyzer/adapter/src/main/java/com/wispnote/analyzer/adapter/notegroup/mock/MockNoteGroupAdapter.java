package com.wispnote.analyzer.adapter.notegroup.mock;

import com.wispnote.analyzer.application.notegroup.model.NoteGroup;
import com.wispnote.analyzer.application.notegroup.port.NoteGroupPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "backend.provider", havingValue = "mock")
public class MockNoteGroupAdapter implements NoteGroupPort {

    @Override
    public List<NoteGroup> findAllByMemberId(UUID memberId) {
        log.info("MOCK - Listing note groups. {}", kv("memberId", memberId));
        return List.of(
                new NoteGroup(UUID.randomUUID(), "Research", "Papers and articles worth revisiting"),
                new NoteGroup(UUID.randomUUID(), "Reading list", "Things to read later"));
    }
}
