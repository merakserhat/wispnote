package com.wispnote.analyzer.infrastructure.persistence.config;

import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EntityScan(basePackages = "com.wispnote.analyzer.adapter")
@EnableJpaRepositories(basePackages = "com.wispnote.analyzer.adapter")
public class JpaConfiguration {
}
