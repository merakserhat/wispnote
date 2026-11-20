package com.wispnote.backend.adapter.feature.togglz;

import com.wispnote.backend.adapter.feature.togglz.enums.TogglzFeatureType;
import com.wispnote.backend.application.feature.enums.FeatureType;
import com.wispnote.backend.application.feature.port.FeaturePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.togglz.core.manager.FeatureManager;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class TogglzAdapter implements FeaturePort {

    private final FeatureManager featureManager;

    @Override
    public boolean isEnabled(FeatureType type) {
        var enabled = featureManager.isActive(TogglzFeatureType.valueOf(type));

        log.info("{} is {}", kv("featureType", type), kv("enabled", enabled));

        return enabled;
    }
}
