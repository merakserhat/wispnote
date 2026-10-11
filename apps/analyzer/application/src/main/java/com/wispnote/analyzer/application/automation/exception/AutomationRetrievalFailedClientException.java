package com.wispnote.analyzer.application.automation.exception;

import com.wispnote.analyzer.application.common.exception.ClientException;

public class AutomationRetrievalFailedClientException extends ClientException {
    public AutomationRetrievalFailedClientException() {
        super("errors.automation.retrievalFailed");
    }
}
