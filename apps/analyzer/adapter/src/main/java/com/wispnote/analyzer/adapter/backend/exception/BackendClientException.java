package com.wispnote.analyzer.adapter.backend.exception;

import com.wispnote.analyzer.application.common.exception.ClientException;

public class BackendClientException extends ClientException {
    public BackendClientException(String message) {
        super(message);
    }
}
