package com.wispnote.backend.adapter.common.converter;

import com.wispnote.backend.adapter.common.exception.EnumConversionFailedBusinessException;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
public class BaseEnumConverter<T extends Enum<T>, R> {
    private final Map<T, R> map;

    public BaseEnumConverter(Map<T, R> map) {
        this.map = map;
    }

    public R fromEnum(T enumToConvert) {
        if (enumToConvert == null) {
            return null;
        }

        if (!map.containsKey(enumToConvert)) {
            log.error("Failed to convert enum {}", kv("enumToConvert", enumToConvert));
            throw new EnumConversionFailedBusinessException("errors.general");
        }

        return this.map.get(enumToConvert);
    }

    public R fromEnum(T enumToConvert, R defaultValue) {
        if (enumToConvert == null) {
            return null;
        }

        if (!map.containsKey(enumToConvert)) {
            log.error("Failed to convert enum {} to {}", kv("enumToConvert", enumToConvert), kv("defaultValue", defaultValue));
            return defaultValue;
        }

        return this.map.get(enumToConvert);
    }

    public T toEnum(R value) {
        if (value == null) {
            return null;
        }

        return this.map.entrySet().stream()
                .filter(entry -> entry.getValue().equals(value))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Failed to convert {} to {}", kv("valueToConvert", value), kv("enumClass", getEnumClassName()));
                    return new EnumConversionFailedBusinessException("errors.general");
                });
    }

    public T toEnum(R value, T defaultValue) {
        if (value == null) {
            return null;
        }

        return this.map.entrySet().stream()
                .filter(entry -> entry.getValue().equals(value))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElseGet(() -> {
                    log.warn("Failed to convert {} to {}. Using default value {}", kv("valueToConvert", value), kv("enumClass", getEnumClassName()), kv("defaultValue", defaultValue));
                    return defaultValue;
                });
    }

    private String getEnumClassName() {
        return this.map.keySet().iterator().next().getClass().getSimpleName();
    }
}
