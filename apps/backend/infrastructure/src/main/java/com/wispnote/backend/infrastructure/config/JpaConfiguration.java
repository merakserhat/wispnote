package com.wispnote.backend.infrastructure.config;

import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = "com.wispnote.backend.adapter")
@EnableJpaRepositories(basePackages = "com.wispnote.backend.adapter")
public class JpaConfiguration {
}
