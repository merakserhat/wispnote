package com.wispnote.analyzer.adapter.llm.config;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "llm.provider", havingValue = "openai", matchIfMissing = true)
public class OpenAiClientConfiguration {

    private final OpenAiProperties openAiProperties;

    @Bean
    public OpenAIClient openAiClient() {
        if (StringUtils.isBlank(openAiProperties.getApiKey())) {
            throw new IllegalStateException("openai.api-key is blank: set OPENAI_API_KEY, or run with llm.provider=mock");
        }

        return OpenAIOkHttpClient.builder()
                .apiKey(openAiProperties.getApiKey())
                .timeout(openAiProperties.getTimeout())
                .maxRetries(openAiProperties.getMaxRetries())
                .build();
    }
}
