package com.wispnote.backend.adapter.analyzer.exception;

import com.wispnote.backend.application.common.exception.ClientException;

public class AnalyzerClientException extends ClientException {
    public AnalyzerClientException(String message) {
        super(message);
    }
}
