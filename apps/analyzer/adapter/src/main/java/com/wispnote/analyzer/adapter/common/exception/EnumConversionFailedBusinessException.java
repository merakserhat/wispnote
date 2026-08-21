package com.wispnote.analyzer.adapter.common.exception;

import com.wispnote.analyzer.application.common.exception.BusinessException;

public class EnumConversionFailedBusinessException extends BusinessException {
    public EnumConversionFailedBusinessException(String message) {
        super(message);
    }
}
