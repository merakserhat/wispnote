package com.wispnote.backend.adapter.emailverification.jpa;

import com.wispnote.backend.adapter.common.exception.EntityNotFoundException;
import com.wispnote.backend.adapter.emailverification.converter.EmailVerificationStatusConverter;
import com.wispnote.backend.adapter.emailverification.jpa.entity.EmailVerificationEntity;
import com.wispnote.backend.adapter.emailverification.jpa.repository.EmailVerificationRepository;
import com.wispnote.backend.application.emailverification.enums.EmailVerificationStatus;
import com.wispnote.backend.application.emailverification.model.EmailVerification;
import com.wispnote.backend.application.emailverification.port.EmailVerificationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EmailVerificationJpaAdapter implements EmailVerificationPort {

    private static final String PENDING = EmailVerificationStatusConverter.jpa.fromEnum(EmailVerificationStatus.PENDING);

    private final EmailVerificationRepository emailVerificationRepository;

    @Override
    public EmailVerification create(EmailVerification emailVerification) {
        var entity = new EmailVerificationEntity();
        entity.setMemberId(emailVerification.memberId());
        entity.setEmail(emailVerification.email());
        entity.setCodeHash(emailVerification.codeHash());
        entity.setStatus(EmailVerificationStatusConverter.jpa.fromEnum(emailVerification.status()));
        entity.setExpiresAt(emailVerification.expiresAt());
        entity.setWrongAttempts(emailVerification.wrongAttempts());

        return emailVerificationRepository.save(entity).toModel();
    }

    @Override
    @Transactional
    public EmailVerification update(EmailVerification emailVerification) {
        var entity = emailVerificationRepository.findByIdAndDeletedFalse(emailVerification.id())
                .orElseThrow(EntityNotFoundException::new);
        entity.setStatus(EmailVerificationStatusConverter.jpa.fromEnum(emailVerification.status()));
        entity.setWrongAttempts(emailVerification.wrongAttempts());

        return emailVerificationRepository.save(entity).toModel();
    }

    @Override
    public List<EmailVerification> findAllPendingByMemberIdForUpdate(UUID memberId) {
        return emailVerificationRepository.lockAllByMemberIdAndStatusAndDeletedFalseOrderByCreatedAtDesc(memberId, PENDING)
                .stream()
                .map(EmailVerificationEntity::toModel)
                .toList();
    }

    @Override
    public List<EmailVerification> findAllByEmailCreatedAfter(String email, Instant from) {
        return emailVerificationRepository.findAllByEmailAndCreatedAtGreaterThanEqualAndDeletedFalseOrderByCreatedAtAsc(email, from)
                .stream()
                .map(EmailVerificationEntity::toModel)
                .toList();
    }
}
