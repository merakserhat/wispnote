package com.wispnote.backend.infrastructure.rest.config;

import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

public class StringTrimmer extends ValueDeserializer<String> {

    @Override
    public String deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) {
        var value = jsonParser.getValueAsString();
        return (value != null) ? value.trim() : null;
    }
}
