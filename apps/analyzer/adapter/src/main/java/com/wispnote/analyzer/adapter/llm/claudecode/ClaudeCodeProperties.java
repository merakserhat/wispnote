package com.wispnote.analyzer.adapter.llm.claudecode;

import com.wispnote.analyzer.adapter.llm.LlmProfile;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.time.Duration;
import java.util.EnumMap;
import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "llm.claude-code")
public class ClaudeCodeProperties {

    private String binary = "claude";
    private Path workingDirectory;
    private Duration timeout = Duration.ofMinutes(2);
    private Map<LlmProfile, String> models = new EnumMap<>(LlmProfile.class);
}
