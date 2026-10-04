package com.wispnote.backend.adapter.common.rest.config;

import com.wispnote.backend.adapter.common.exception.NotFoundException;
import com.wispnote.backend.adapter.common.rest.response.ErrorResponse;
import com.wispnote.backend.application.common.exception.BusinessException;
import com.wispnote.backend.application.common.exception.ClientException;
import com.wispnote.backend.application.common.exception.NotFoundBusinessException;
import com.wispnote.backend.application.common.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.TypeMismatchException;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice(basePackages = "com.wispnote.backend.adapter")
public class RestExceptionHandler {

    public static final String GENERIC_ERROR_CODE = "GENERIC_ERROR";
    public static final String INVALID_REQUEST_CODE = "INVALID_REQUEST";
    public static final String NOT_FOUND_CODE = "NOT_FOUND";

    private final MessageSource messageSource;

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handle(Exception e) {
        log.error("An unhandled error occurred", e);
        return new ErrorResponse(GENERIC_ERROR_CODE, getMessage("errors.general"));
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
        log.info("MethodArgumentNotValidException occurred", e);
        return new ErrorResponse(INVALID_REQUEST_CODE, e.getAllErrors().getFirst().getDefaultMessage());
    }

    @ExceptionHandler
    @ResponseStatus(UNPROCESSABLE_ENTITY)
    public ErrorResponse handleNotFound(NotFoundException e) {
        log.warn("A NotFoundException occurred. Message: {}", e.getMessage(), e);
        return new ErrorResponse(NOT_FOUND_CODE, getMessage("errors.entity.notFound"));
    }

    @ExceptionHandler
    @ResponseStatus(UNPROCESSABLE_ENTITY)
    public ErrorResponse handleNotFound(NotFoundBusinessException e) {
        log.warn("A NotFoundBusinessException occurred. Message: {}", e.getMessage(), e);
        return new ErrorResponse(NOT_FOUND_CODE, getMessage("errors.entity.notFound"));
    }

    @ExceptionHandler
    @ResponseStatus(UNPROCESSABLE_ENTITY)
    public ErrorResponse handleValidation(ValidationException e) {
        log.warn("A ValidationException occurred. Message: {}", e.getMessage(), e);
        return new ErrorResponse(INVALID_REQUEST_CODE, getMessage(e.getMessage()));
    }

    @ExceptionHandler
    @ResponseStatus(UNPROCESSABLE_ENTITY)
    public ErrorResponse handleClient(ClientException e) {
        log.error("A ClientException occurred. Message: {}", e.getMessage(), e);
        return new ErrorResponse(GENERIC_ERROR_CODE, getMessage("errors.general"));
    }

    @ExceptionHandler
    @ResponseStatus(UNPROCESSABLE_ENTITY)
    public ErrorResponse handleBusiness(BusinessException e) {
        log.warn("A BusinessException occurred. Message: {}", e.getMessage(), e);
        return new ErrorResponse(GENERIC_ERROR_CODE, getMessage("errors.general"));
    }

    @ExceptionHandler({
            HttpRequestMethodNotSupportedException.class,
            HttpMediaTypeNotSupportedException.class,
            HttpMediaTypeNotAcceptableException.class,
            HandlerMethodValidationException.class,
            NoHandlerFoundException.class,
            NoResourceFoundException.class,
            TypeMismatchException.class,
            HttpMessageNotReadableException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestExceptions(Exception e) {
        log.info("BadRequestException occurred", e);
        return new ErrorResponse(INVALID_REQUEST_CODE, getMessage("errors.general"));
    }

    private String getMessage(String messageKey, String... args) {
        return messageSource.getMessage(messageKey, args, LocaleContextHolder.getLocale());
    }
}
