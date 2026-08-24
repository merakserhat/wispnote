package com.wispnote.analyzer.adapter.llm.config;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.wispnote.analyzer.adapter.llm.anthropic.AnthropicProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "llm.provider", havingValue = "anthropic-api")
public class LlmConfiguration {

    private final AnthropicProperties anthropicProperties;

    @Bean
    AnthropicClient anthropicClient() {
        return AnthropicOkHttpClient.builder()
                .apiKey(anthropicProperties.getApiKey())
                .timeout(anthropicProperties.getTimeout())
                .build();
    }
}
