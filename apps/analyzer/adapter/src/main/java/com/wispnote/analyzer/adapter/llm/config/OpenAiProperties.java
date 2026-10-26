package com.wispnote.analyzer.adapter.llm.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "openai")
public class OpenAiProperties {
    private String apiKey;
    private String model = "gpt-5-mini";
    private long maxOutputTokens = 2048L;
    private String reasoningEffort = "low";
    private Duration timeout = Duration.ofSeconds(15);
    private int maxRetries = 3;
}
