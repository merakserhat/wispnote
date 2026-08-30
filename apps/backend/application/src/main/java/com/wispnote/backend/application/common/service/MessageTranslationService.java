package com.wispnote.backend.application.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageTranslationService {
    private final MessageSource messageSource;

    public String getMessage(String key) {
        return getMessage(key, Collections.emptyList());
    }

    public String getMessage(String key, Collection<String> values) {
        try {
            var locale = LocaleContextHolder.getLocale();
            return messageSource.getMessage(key, values.toArray(), locale);
        } catch (NoSuchMessageException e) {
            log.error("An error occurred in message source {}", kv("key", key), e);
            return null;
        }
    }
}
