package com.wispnote.analyzer.adapter.llm;

public interface LlmClient {

    <T> T complete(LlmCall call, Class<T> responseType);
}
