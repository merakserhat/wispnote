package com.wispnote.backend.adapter.common.util;

import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
public class StringUtil {

    public static UUID toUUID(String uuidString) {
        try {
            return UUID.fromString(uuidString);
        } catch (IllegalArgumentException ex) {
            log.warn("Couldn't convert {} to UUID", kv("uuidString", uuidString));
            return null;
        }
    }
}
