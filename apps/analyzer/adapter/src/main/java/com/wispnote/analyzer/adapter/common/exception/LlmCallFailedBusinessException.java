package com.wispnote.analyzer.adapter.common.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class LlmCallFailedBusinessException extends BusinessException {
    public LlmCallFailedBusinessException(String message) {
        super(message);
    }
}
