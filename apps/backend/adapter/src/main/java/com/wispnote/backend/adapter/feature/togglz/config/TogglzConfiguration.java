package com.wispnote.backend.adapter.feature.togglz.config;

import com.wispnote.backend.adapter.feature.togglz.enums.TogglzFeatureType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.togglz.core.manager.FeatureManager;
import org.togglz.core.manager.FeatureManagerBuilder;
import org.togglz.core.repository.StateRepository;
import org.togglz.core.repository.jdbc.JDBCStateRepository;
import org.togglz.core.user.NoOpUserProvider;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
public class TogglzConfiguration {
    private static final String FEATURE_TABLE = "feature_flag";

    private final DataSource dataSource;

    @Bean
    public FeatureManager featureManager() {
        return new FeatureManagerBuilder()
                .featureEnum(TogglzFeatureType.class)
                .stateRepository(stateRepository())
                .userProvider(new NoOpUserProvider())
                .build();
    }

    private StateRepository stateRepository() {
        return JDBCStateRepository.newBuilder(dataSource)
                .tableName(FEATURE_TABLE)
                .createTable(false)
                .build();
    }
}
