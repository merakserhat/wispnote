package com.wispnote.analyzer.adapter.actiondetection.mock;

import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionResult;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationActionDetectionPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "mock")
public class MockAutomationActionDetectionAdapter implements AutomationActionDetectionPort {

    @Override
    public AutomationActionDetectionResult detect(AutomationActionDetectionRequest request) {
        log.info("MOCK - Detecting automation action. {}", kv("ruleText", request.ruleText()));
        return AutomationActionDetectionResult.detected(AutomationActionType.ADD_NOTE_TO_GROUP, 100, "Mock: adds matching notes to a group.");
    }
}
