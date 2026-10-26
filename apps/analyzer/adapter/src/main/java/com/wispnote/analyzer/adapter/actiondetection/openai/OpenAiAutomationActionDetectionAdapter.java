package com.wispnote.analyzer.adapter.actiondetection.openai;

import com.openai.client.OpenAIClient;
import com.openai.errors.OpenAIException;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.*;
import com.wispnote.analyzer.adapter.llm.LlmAnswers;
import com.wispnote.analyzer.adapter.llm.SystemPrompts;
import com.wispnote.analyzer.adapter.llm.UntrustedUserData;
import com.wispnote.analyzer.adapter.llm.config.OpenAiProperties;
import com.wispnote.analyzer.application.automationcheckrun.enums.AutomationActionType;
import com.wispnote.analyzer.application.automationcheckrun.exception.AutomationActionDetectionFailedException;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionResult;
import com.wispnote.analyzer.application.automationcheckrun.port.AutomationActionDetectionPort;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.util.stream.Collectors;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "openai", matchIfMissing = true)
public class OpenAiAutomationActionDetectionAdapter implements AutomationActionDetectionPort {

    static final String SYSTEM_PROMPT_NAME = "automation-action-detection-system";

    static final String SUPPORTED_ACTIONS_HEADER = "Actions this platform supports: ";

    private final OpenAIClient openAiClient;
    private final OpenAiProperties openAiProperties;
    private final JsonMapper jsonMapper;
    private final String systemPrompt;

    public OpenAiAutomationActionDetectionAdapter(OpenAIClient openAiClient, OpenAiProperties openAiProperties, JsonMapper jsonMapper) {
        this.openAiClient = openAiClient;
        this.openAiProperties = openAiProperties;
        this.jsonMapper = jsonMapper;
        this.systemPrompt = SystemPrompts.load(SYSTEM_PROMPT_NAME);
    }

    @Override
    public AutomationActionDetectionResult detect(AutomationActionDetectionRequest request) {
        var params = buildParams(request);
        log.info("Detecting automation action with OpenAI. {}", kv("model", openAiProperties.getModel()));

        StructuredResponse<AutomationActionDetectionOutput> response;
        try {
            response = openAiClient.responses().create(params);
        } catch (OpenAIException e) {
            log.warn("OpenAI call failed.", e);
            throw new AutomationActionDetectionFailedException();
        }

        logUsage(response);

        if (LlmAnswers.isIncomplete(response)) {
            log.error("OpenAI stopped before finishing the answer, not parsing it. {}, {}, {}",
                    kv("status", response.status().orElse(null)), kv("incompleteDetails", response.incompleteDetails().orElse(null)),
                    kv("maxOutputTokens", openAiProperties.getMaxOutputTokens()));
            throw new AutomationActionDetectionFailedException();
        }

        return toResult(response);
    }

    StructuredResponseCreateParams<AutomationActionDetectionOutput> buildParams(AutomationActionDetectionRequest request) {
        var builder = ResponseCreateParams.builder()
                .model(openAiProperties.getModel())
                .maxOutputTokens(openAiProperties.getMaxOutputTokens())
                .instructions(systemPrompt)
                .input(userMessage(request))
                .text(AutomationActionDetectionOutput.class);

        if (StringUtils.isNotBlank(openAiProperties.getReasoningEffort())) {
            builder.reasoning(Reasoning.builder().effort(ReasoningEffort.of(openAiProperties.getReasoningEffort())).build());
        }

        return builder.build();
    }

    private String userMessage(AutomationActionDetectionRequest request) {
        var supportedActions = request.supportedActionTypes().stream()
                .map(AutomationActionType::name)
                .collect(Collectors.joining(", "));

        return SUPPORTED_ACTIONS_HEADER + supportedActions
                + "\n" + UntrustedUserData.wrap(jsonMapper, AutomationActionDetectionInput.from(request));
    }

    private void logUsage(StructuredResponse<AutomationActionDetectionOutput> response) {
        var inputTokens = response.usage().map(ResponseUsage::inputTokens).orElse(null);
        var outputTokens = response.usage().map(ResponseUsage::outputTokens).orElse(null);
        log.info("OpenAI call completed. {}, {}, {}",
                kv("inputTokens", inputTokens),
                kv("outputTokens", outputTokens),
                kv("status", response.status().orElse(null)));
    }

    private AutomationActionDetectionResult toResult(StructuredResponse<AutomationActionDetectionOutput> response) {
        try {
            var content = LlmAnswers.firstContent(response);
            return content.flatMap(StructuredResponseOutputMessage.Content::outputText)
                    .map(AutomationActionDetectionOutput::toModel)
                    .orElseThrow(() -> {
                        log.error("OpenAI answer has no structured output. {}",
                                kv("refusal", content.flatMap(StructuredResponseOutputMessage.Content::refusal).orElse(null)));
                        return new AutomationActionDetectionFailedException();
                    });
        } catch (OpenAIException | IllegalStateException | IllegalArgumentException e) {
            log.error("OpenAI answer could not be parsed.", e);
            throw new AutomationActionDetectionFailedException();
        }
    }
}
