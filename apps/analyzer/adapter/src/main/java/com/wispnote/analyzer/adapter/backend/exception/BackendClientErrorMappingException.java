package com.wispnote.analyzer.adapter.backend.exception;

import com.wispnote.analyzer.application.common.exception.ClientException;

public class BackendClientErrorMappingException extends ClientException {
    public BackendClientErrorMappingException(String message) {
        super(message);
    }
}
