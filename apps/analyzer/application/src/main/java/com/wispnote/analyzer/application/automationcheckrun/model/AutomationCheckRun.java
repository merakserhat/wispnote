package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationCheckRunStatus;
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

    public boolean isIdentical(AutomationFingerprint otherFingerprint) {
        return fingerprint.equals(otherFingerprint);
    }

    public AutomationCheckRun updateFingerprint(AutomationFingerprint fingerprint) {
        var invalidatedItems = items.invalidated();
        return new AutomationCheckRun(id, version, automationId, memberId, fingerprint, confidence, invalidatedItems);
    }
}
