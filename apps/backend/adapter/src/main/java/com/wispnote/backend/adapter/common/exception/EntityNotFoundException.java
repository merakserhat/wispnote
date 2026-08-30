package com.wispnote.backend.adapter.common.exception;

public class EntityNotFoundException extends NotFoundException {
    public EntityNotFoundException() {
        super("errors.entity.notFound");
    }
}
