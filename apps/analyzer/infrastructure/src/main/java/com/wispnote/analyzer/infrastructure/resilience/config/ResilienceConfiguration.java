package com.wispnote.analyzer.infrastructure.resilience.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.resilience.annotation.EnableResilientMethods;

/**
 * Activates Spring's declarative resilience annotations ({@code @Retryable}, {@code @ConcurrencyLimit}). Nothing in
 * Spring Boot's auto-configuration enables them; without this the annotated beans are never proxied.
 */
@Configuration
@EnableResilientMethods
public class ResilienceConfiguration {
}
