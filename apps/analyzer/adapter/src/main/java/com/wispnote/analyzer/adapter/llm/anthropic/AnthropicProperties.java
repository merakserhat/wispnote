package com.wispnote.analyzer.adapter.llm.anthropic;

import com.wispnote.analyzer.adapter.llm.LlmProfile;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.EnumMap;
import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "llm.anthropic-api")
public class AnthropicProperties {

    private String apiKey;
    private Duration timeout = Duration.ofSeconds(60);
    private Map<LlmProfile, String> models = new EnumMap<>(LlmProfile.class);
    private Map<LlmProfile, Long> maxTokens = new EnumMap<>(LlmProfile.class);
}
