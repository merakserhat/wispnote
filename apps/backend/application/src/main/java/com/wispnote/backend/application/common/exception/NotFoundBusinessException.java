package com.wispnote.backend.application.common.exception;

public class NotFoundBusinessException extends BusinessException {
    public NotFoundBusinessException() {
        super("errors.entity.notFound");
    }
}
