package com.wispnote.backend.infrastructure.rest.config;

import com.wispnote.backend.infrastructure.rest.interceptor.ControllerLogInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tools.jackson.databind.JacksonModule;
import tools.jackson.databind.module.SimpleModule;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ControllerLogInterceptor());
    }

    /**
     * Trims every incoming String so requests can't smuggle in leading/trailing whitespace.
     */
    @Bean
    public JacksonModule stringTrimmerModule() {
        var module = new SimpleModule("StringTrimmerModule");
        module.addDeserializer(String.class, new StringTrimmer());
        return module;
    }
}
