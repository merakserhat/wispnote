package com.wispnote.backend.adapter.mail.smtp.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "mail")
public class MailProperties {
    private String provider;
    private String from;
    private String fromName;
    private String exchange;
    private String queue;
}
