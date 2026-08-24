package com.wispnote.analyzer.adapter.llm;

/**
 * How much thinking a call is worth. The domain adapters say what kind of work they are asking for; each
 * provider maps that to its own model, so no adapter ever names a model.
 */
public enum LlmProfile {
    CLASSIFY,
    ENRICH
}
