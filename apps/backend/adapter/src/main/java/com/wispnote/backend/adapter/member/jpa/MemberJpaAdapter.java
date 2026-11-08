package com.wispnote.backend.adapter.member.jpa;

import com.wispnote.backend.adapter.common.exception.EntityNotFoundException;
import com.wispnote.backend.adapter.member.jpa.entity.MemberEntity;
import com.wispnote.backend.adapter.member.jpa.repository.MemberRepository;
import com.wispnote.backend.application.member.model.Member;
import com.wispnote.backend.application.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class MemberJpaAdapter implements MemberPort {

    private final MemberRepository memberRepository;

    @Override
    public boolean existsByEmail(String email) {
        return memberRepository.existsByEmailAndDeletedFalse(email);
    }

    @Override
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmailAndDeletedFalse(email)
                .map(MemberEntity::toModel);
    }

    @Override
    public Optional<Member> findById(UUID id) {
        return memberRepository.findByIdAndDeletedFalse(id)
                .map(MemberEntity::toModel);
    }

    @Override
    public Member create(String email, String passwordHash) {
        var memberEntity = new MemberEntity();
        memberEntity.setEmail(email);
        memberEntity.setPasswordHash(passwordHash);

        return memberRepository.save(memberEntity).toModel();
    }

    @Override
    public void delete(UUID id) {
        log.info("Deleting member by {}", kv("id", id));
        var member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(EntityNotFoundException::new);
        member.setDeleted(true);
        memberRepository.saveAndFlush(member);
    }

    @Override
    public void markEmailVerified(UUID id, Instant verifiedAt) {
        var member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(EntityNotFoundException::new);
        member.setEmailVerifiedAt(verifiedAt);
        memberRepository.save(member);
    }
}
