package com.wispnote.backend.adapter.mail.mock;

import com.wispnote.backend.application.mail.model.MailMessage;
import com.wispnote.backend.application.mail.port.MailSenderPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@ConditionalOnProperty(name = "mail.provider", havingValue = "mock", matchIfMissing = true)
public class MockMailSenderAdapter implements MailSenderPort {

    @Override
    public void send(MailMessage message) {
        log.info("Mock mail {} {} {}", kv("to", message.to()), kv("subject", message.subject()), kv("body", message.body()));
    }
}
