package com.wispnote.analyzer.adapter.llm.anthropic;

import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.TextBlockParam;
import com.wispnote.analyzer.adapter.common.exception.LlmCallFailedBusinessException;
import com.wispnote.analyzer.adapter.llm.LlmCall;
import com.wispnote.analyzer.adapter.llm.LlmClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "llm.provider", havingValue = "anthropic-api")
public class AnthropicApiLlmClient implements LlmClient {

    private final AnthropicClient anthropicClient;
    private final AnthropicProperties anthropicProperties;

    @Override
    public <T> T complete(LlmCall call, Class<T> responseType) {
        var params = MessageCreateParams.builder()
                .model(anthropicProperties.getModels().get(call.profile()))
                .maxTokens(anthropicProperties.getMaxTokens().get(call.profile()))
                .systemOfTextBlockParams(List.of(TextBlockParam.builder()
                        .text(call.systemInstruction())
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build()))
                .addUserMessage(call.userInput())
                .outputConfig(responseType)
                .build();

        log.info("Calling the Anthropic API {} {}", kv("profile", call.profile()), kv("responseType", responseType.getSimpleName()));

        return anthropicClient.messages().create(params).content().stream()
                .flatMap(block -> block.text().stream())
                .map(block -> block.text())
                .findFirst()
                .orElseThrow(() -> {
                    log.error("The Anthropic API returned no structured output {}", kv("responseType", responseType.getSimpleName()));
                    return new LlmCallFailedBusinessException("errors.general");
                });
    }
}
