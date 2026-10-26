package com.wispnote.analyzer.adapter.llm;

import com.openai.models.responses.ResponseStatus;
import com.openai.models.responses.StructuredResponse;
import com.openai.models.responses.StructuredResponseOutputMessage;

import java.util.Optional;

public final class LlmAnswers {

    private LlmAnswers() {
    }

    public static boolean isIncomplete(StructuredResponse<?> response) {
        return response.status().filter(ResponseStatus.COMPLETED::equals).isEmpty();
    }

    public static <T> Optional<StructuredResponseOutputMessage.Content<T>> firstContent(StructuredResponse<T> response) {
        return response.output().stream()
                .flatMap(item -> item.message().stream())
                .flatMap(message -> message.content().stream())
                .findFirst();
    }
}
