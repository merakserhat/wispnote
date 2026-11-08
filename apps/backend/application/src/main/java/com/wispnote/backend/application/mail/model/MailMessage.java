package com.wispnote.backend.application.mail.model;

public record MailMessage(String to, String subject, String body) {
}
