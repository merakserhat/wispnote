package com.wispnote.analyzer.adapter.llm.claudecode;

import com.github.victools.jsonschema.generator.Option;
import com.github.victools.jsonschema.generator.OptionPreset;
import com.github.victools.jsonschema.generator.SchemaGenerator;
import com.github.victools.jsonschema.generator.SchemaGeneratorConfigBuilder;
import com.github.victools.jsonschema.generator.SchemaVersion;
import com.github.victools.jsonschema.module.jackson.JacksonModule;
import com.github.victools.jsonschema.module.jackson.JacksonOption;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ResponseSchemaWriter {

    private final SchemaGenerator schemaGenerator;
    private final Map<Class<?>, String> schemaCache = new ConcurrentHashMap<>();

    public ResponseSchemaWriter() {
        var configuration = new SchemaGeneratorConfigBuilder(SchemaVersion.DRAFT_2020_12, OptionPreset.PLAIN_JSON)
                .with(new JacksonModule(JacksonOption.RESPECT_JSONPROPERTY_REQUIRED))
                .with(Option.FORBIDDEN_ADDITIONAL_PROPERTIES_BY_DEFAULT)
                .build();
        this.schemaGenerator = new SchemaGenerator(configuration);
    }

    public String schemaFor(Class<?> responseType) {
        return schemaCache.computeIfAbsent(responseType, type -> schemaGenerator.generateSchema(type).toString());
    }
}
