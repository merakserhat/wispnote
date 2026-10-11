package com.wispnote.analyzer.application.automationcheckrun.model;

import com.wispnote.analyzer.application.automation.model.Automation;
import lombok.extern.slf4j.Slf4j;

import java.util.LinkedHashMap;
import java.util.Objects;
import java.util.SequencedMap;
import java.util.Set;
import java.util.function.Function;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
public record AutomationFingerprint(Integer value) {

    private static final SequencedMap<String, Function<Automation, Object>> FIELDS = fields();

    public static AutomationFingerprint of(Automation automation) {
        log.info("Hashing automation {}", kv("automationId", automation.id()));
        var values = FIELDS.values().stream()
                .map(field -> field.apply(automation))
                .toArray();
        return new AutomationFingerprint(Objects.hash(values));
    }

    private static SequencedMap<String, Function<Automation, Object>> fields() {
        var fields = new LinkedHashMap<String, Function<Automation, Object>>();
        fields.put("ruleText", Automation::ruleText);
        return fields;
    }
}
