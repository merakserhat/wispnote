package com.wispnote.analyzer.adapter.llm;

public record LlmCall(String systemInstruction, String userInput, LlmProfile profile) {

    public static LlmCall classify(String systemInstruction, String userInput) {
        return new LlmCall(systemInstruction, userInput, LlmProfile.CLASSIFY);
    }

    public static LlmCall enrich(String systemInstruction, String userInput) {
        return new LlmCall(systemInstruction, userInput, LlmProfile.ENRICH);
    }
}
