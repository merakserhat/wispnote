package com.wispnote.backend.adapter.common.exception;

import com.wispnote.backend.application.common.exception.BusinessException;

public class EnumConversionFailedBusinessException extends BusinessException {
    public EnumConversionFailedBusinessException(String message) {
        super(message);
    }
}
