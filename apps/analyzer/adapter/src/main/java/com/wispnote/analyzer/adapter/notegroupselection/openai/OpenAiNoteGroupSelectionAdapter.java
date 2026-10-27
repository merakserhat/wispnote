package com.wispnote.analyzer.adapter.notegroupselection.openai;

import com.openai.client.OpenAIClient;
import com.openai.errors.OpenAIException;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseUsage;
import com.openai.models.responses.StructuredResponse;
import com.openai.models.responses.StructuredResponseCreateParams;
import com.openai.models.responses.StructuredResponseOutputMessage;
import com.wispnote.analyzer.adapter.llm.LlmAnswers;
import com.wispnote.analyzer.adapter.llm.SystemPrompts;
import com.wispnote.analyzer.adapter.llm.UntrustedUserData;
import com.wispnote.analyzer.adapter.llm.config.OpenAiProperties;
import com.wispnote.analyzer.application.automationcheckrun.exception.NoteGroupSelectionFailedException;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.NoteGroupSelectionResult;
import com.wispnote.analyzer.application.automationcheckrun.port.NoteGroupSelectionPort;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "openai", matchIfMissing = true)
public class OpenAiNoteGroupSelectionAdapter implements NoteGroupSelectionPort {

    static final String SYSTEM_PROMPT_NAME = "note-group-selection-system";

    private final OpenAIClient openAiClient;
    private final OpenAiProperties openAiProperties;
    private final JsonMapper jsonMapper;
    private final String systemPrompt;

    public OpenAiNoteGroupSelectionAdapter(OpenAIClient openAiClient, OpenAiProperties openAiProperties, JsonMapper jsonMapper) {
        this.openAiClient = openAiClient;
        this.openAiProperties = openAiProperties;
        this.jsonMapper = jsonMapper;
        this.systemPrompt = SystemPrompts.load(SYSTEM_PROMPT_NAME);
    }

    @Override
    public NoteGroupSelectionResult select(NoteGroupSelectionRequest request) {
        var params = buildParams(request);
        log.info("Selecting note group with OpenAI. {}, {}",
                kv("model", openAiProperties.getModel()),
                kv("existingGroupCount", request.groups().size()));

        StructuredResponse<NoteGroupSelectionOutput> response;
        try {
            response = openAiClient.responses().create(params);
        } catch (OpenAIException e) {
            log.warn("OpenAI call failed.", e);
            throw new NoteGroupSelectionFailedException();
        }

        logUsage(response);

        if (LlmAnswers.isIncomplete(response)) {
            log.error("OpenAI stopped before finishing the answer, not parsing it. {}, {}, {}",
                    kv("status", response.status().orElse(null)), kv("incompleteDetails", response.incompleteDetails().orElse(null)),
                    kv("maxOutputTokens", openAiProperties.getMaxOutputTokens()));
            throw new NoteGroupSelectionFailedException();
        }

        return toResult(response);
    }

    StructuredResponseCreateParams<NoteGroupSelectionOutput> buildParams(NoteGroupSelectionRequest request) {
        var builder = ResponseCreateParams.builder()
                .model(openAiProperties.getModel())
                .maxOutputTokens(openAiProperties.getMaxOutputTokens())
                .instructions(systemPrompt)
                .input(UntrustedUserData.wrap(jsonMapper, NoteGroupSelectionInput.from(request)))
                .text(NoteGroupSelectionOutput.class);

        if (StringUtils.isNotBlank(openAiProperties.getReasoningEffort())) {
            builder.reasoning(Reasoning.builder().effort(ReasoningEffort.of(openAiProperties.getReasoningEffort())).build());
        }

        return builder.build();
    }

    private void logUsage(StructuredResponse<NoteGroupSelectionOutput> response) {
        var inputTokens = response.usage().map(ResponseUsage::inputTokens).orElse(null);
        var outputTokens = response.usage().map(ResponseUsage::outputTokens).orElse(null);
        log.info("OpenAI call completed. {}, {}, {}",
                kv("inputTokens", inputTokens),
                kv("outputTokens", outputTokens),
                kv("status", response.status().orElse(null)));
    }

    private NoteGroupSelectionResult toResult(StructuredResponse<NoteGroupSelectionOutput> response) {
        try {
            var content = LlmAnswers.firstContent(response);
            return content.flatMap(StructuredResponseOutputMessage.Content::outputText)
                    .map(NoteGroupSelectionOutput::toModel)
                    .orElseThrow(() -> {
                        log.error("OpenAI answer has no structured output. {}",
                                kv("refusal", content.flatMap(StructuredResponseOutputMessage.Content::refusal).orElse(null)));
                        return new NoteGroupSelectionFailedException();
                    });
        } catch (OpenAIException | IllegalStateException | IllegalArgumentException e) {
            log.error("OpenAI answer could not be parsed.", e);
            throw new NoteGroupSelectionFailedException();
        }
    }
}
