package com.wispnote.backend.adapter.emailverification.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.backend.adapter.emailverification.converter.EmailVerificationStatusConverter;
import com.wispnote.backend.application.emailverification.model.EmailVerification;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "email_verification")
public class EmailVerificationEntity extends BaseEntity {

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String codeHash;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private Integer wrongAttempts = 0;

    public EmailVerification toModel() {
        return new EmailVerification(
                getId(),
                memberId,
                email,
                codeHash,
                EmailVerificationStatusConverter.jpa.toEnum(status),
                expiresAt,
                wrongAttempts,
                getCreatedAt());
    }
}
