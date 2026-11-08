package com.wispnote.backend.adapter.mail.smtp;

import com.wispnote.backend.adapter.common.rabbit.RabbitPublisher;
import com.wispnote.backend.adapter.mail.smtp.config.MailProperties;
import com.wispnote.backend.application.mail.model.MailMessage;
import com.wispnote.backend.application.mail.port.MailSenderPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;

import static com.wispnote.backend.adapter.mail.smtp.config.MailQueueConfiguration.MAIL_SEND;
import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "mail.provider", havingValue = "smtp")
public class RabbitMailSenderAdapter implements MailSenderPort {

    private final RabbitPublisher rabbitPublisher;
    private final MailProperties properties;

    @Override
    public void send(MailMessage message) {
        var messageId = UUID.randomUUID();
        log.info("Queueing mail {} {} {}", kv("messageId", messageId), kv("to", message.to()), kv("subject", message.subject()));
        rabbitPublisher.publish(properties.getExchange(), MAIL_SEND, messageId, message);
    }
}
