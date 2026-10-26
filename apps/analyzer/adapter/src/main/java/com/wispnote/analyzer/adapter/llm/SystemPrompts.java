package com.wispnote.analyzer.adapter.llm;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

public final class SystemPrompts {

    private SystemPrompts() {
    }

    public static String load(String name) {
        var location = "prompts/" + name + ".txt";
        try {
            return new ClassPathResource(location).getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new UncheckedIOException("Cannot load system prompt from " + location, e);
        }
    }
}
