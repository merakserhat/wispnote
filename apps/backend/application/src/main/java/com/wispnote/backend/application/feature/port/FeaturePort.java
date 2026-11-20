package com.wispnote.backend.application.feature.port;

import com.wispnote.backend.application.feature.enums.FeatureType;

public interface FeaturePort {
    boolean isEnabled(FeatureType type);
}
