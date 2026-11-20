package com.wispnote.backend.adapter.feature.togglz.enums;

import com.wispnote.backend.adapter.feature.togglz.exception.TogglzFeatureMappingException;
import com.wispnote.backend.application.feature.enums.FeatureType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.togglz.core.Feature;

import java.util.stream.Stream;

@Getter
@RequiredArgsConstructor
public enum TogglzFeatureType implements Feature {
    ADMIN_APPROVAL_REQUIRED(FeatureType.ADMIN_APPROVAL_REQUIRED);

    private final FeatureType featureType;

    public static TogglzFeatureType valueOf(FeatureType type) {
        return Stream.of(TogglzFeatureType.values())
                .filter(togglzFeature -> togglzFeature.getFeatureType() == type)
                .findFirst()
                .orElseThrow(TogglzFeatureMappingException::new);
    }
}
