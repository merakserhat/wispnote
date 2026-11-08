package com.wispnote.backend.application.emailverification.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "email-verification")
public class EmailVerificationProperties {
    private Duration expiresIn;
    private Integer maxWrongAttempts;
    private Integer maxSendsPerWindow;
    private Duration sendWindow;

    public int expiresInSeconds() {
        return Math.toIntExact(expiresIn.toSeconds());
    }
}
