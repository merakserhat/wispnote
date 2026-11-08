package com.wispnote.backend.application.mail.port;

import com.wispnote.backend.application.mail.model.MailMessage;

public interface MailSenderPort {
    void send(MailMessage message);
}
