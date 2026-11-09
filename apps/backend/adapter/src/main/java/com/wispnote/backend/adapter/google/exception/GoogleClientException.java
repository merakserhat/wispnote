package com.wispnote.backend.adapter.google.exception;

import com.wispnote.backend.application.common.exception.ClientException;

public class GoogleClientException extends ClientException {
    public GoogleClientException(String message) {
        super(message);
    }

    public GoogleClientException(String message, Throwable cause) {
        super(message, cause);
    }
}
