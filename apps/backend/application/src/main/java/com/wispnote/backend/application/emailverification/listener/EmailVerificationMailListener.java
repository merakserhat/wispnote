package com.wispnote.backend.application.emailverification.listener;

import com.wispnote.backend.application.common.service.MessageTranslationService;
import com.wispnote.backend.application.emailverification.event.EmailVerificationIssuedEvent;
import com.wispnote.backend.application.emailverification.properties.EmailVerificationProperties;
import com.wispnote.backend.application.mail.model.MailMessage;
import com.wispnote.backend.application.mail.port.MailSenderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmailVerificationMailListener {

    private final MailSenderPort mailSenderPort;
    private final MessageTranslationService messageTranslationService;
    private final EmailVerificationProperties properties;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void send(EmailVerificationIssuedEvent event) {
        var expiresInMinutes = String.valueOf(properties.getExpiresIn().toMinutes());
        var subject = messageTranslationService.getMessage("mail.emailVerification.subject");
        var body = messageTranslationService.getMessage("mail.emailVerification.body", List.of(event.code(), expiresInMinutes));

        mailSenderPort.send(new MailMessage(event.email(), subject, body));
    }
}
