package com.wispnote.backend.adapter.feature.togglz.exception;

import com.wispnote.backend.application.common.exception.BusinessException;

public class TogglzFeatureMappingException extends BusinessException {
    public TogglzFeatureMappingException() {
        super("errors.general");
    }
}
