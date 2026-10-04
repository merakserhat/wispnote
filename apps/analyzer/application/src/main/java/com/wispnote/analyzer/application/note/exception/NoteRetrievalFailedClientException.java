package com.wispnote.analyzer.application.note.exception;

import com.wispnote.analyzer.application.common.exception.ClientException;

public class NoteRetrievalFailedClientException extends ClientException {
    public NoteRetrievalFailedClientException() {
        super("errors.note.retrievalFailed");
    }
}
