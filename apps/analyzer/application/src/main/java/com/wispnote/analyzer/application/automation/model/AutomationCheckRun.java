package com.wispnote.analyzer.application.automation.model;

import com.wispnote.analyzer.application.automation.enums.AutomationCheckRunStatus;
import lombok.AccessLevel;
import lombok.With;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
public record AutomationCheckRun(UUID id,
                                 Long version,
                                 UUID automationId,
                                 UUID memberId,
                                 AutomationFingerprint fingerprint,
                                 Integer confidence,
                                 AutomationCheckRunItems items) {

    public AutomationCheckRunStatus status() {
        return items.status();
    }
}
