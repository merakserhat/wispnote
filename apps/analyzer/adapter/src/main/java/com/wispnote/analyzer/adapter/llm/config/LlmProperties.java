package com.wispnote.analyzer.adapter.llm.config;

import com.wispnote.analyzer.adapter.llm.enums.LlmProviderType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "llm")
public class LlmProperties {
    private LlmProviderType provider;
}
