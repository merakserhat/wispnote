package com.wispnote.backend.adapter.mail.smtp;

import com.wispnote.backend.adapter.mail.smtp.config.MailProperties;
import com.wispnote.backend.application.mail.model.MailMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailPreparationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import static net.logstash.logback.argument.StructuredArguments.kv;
import static org.springframework.amqp.support.AmqpHeaders.MESSAGE_ID;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "mail.provider", havingValue = "smtp")
public class MailMessageConsumer {

    private final JavaMailSender mailSender;
    private final MailProperties properties;

    @RabbitListener(queues = "${mail.queue}")
    public void consume(@Payload MailMessage message, @Header(MESSAGE_ID) String messageId) {
        log.info("Sending mail {} {} {}", kv("messageId", messageId), kv("to", message.to()), kv("subject", message.subject()));

        var mimeMessage = prepareMessage(message);
        mailSender.send(mimeMessage);

        log.info("Mail sent {} {}", kv("messageId", messageId), kv("to", message.to()));
    }

    private MimeMessage prepareMessage(MailMessage message) {
        try {
            var mimeMessage = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(properties.getFrom(), properties.getFromName()));
            helper.setTo(message.to());
            helper.setSubject(message.subject());
            helper.setText(message.body(), false);
            return mimeMessage;
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new MailPreparationException("Mail message could not be prepared", e);
        }
    }
}
