package com.wispnote.backend.adapter.common.member.jpa;

import com.wispnote.backend.adapter.common.member.jpa.entity.MemberEntity;
import com.wispnote.backend.adapter.common.member.jpa.repository.MemberRepository;
import com.wispnote.backend.application.common.member.model.Member;
import com.wispnote.backend.application.common.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

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
    public Member create(String email, String passwordHash) {
        var memberEntity = new MemberEntity();
        memberEntity.setEmail(email);
        memberEntity.setPasswordHash(passwordHash);

        return memberRepository.save(memberEntity).toModel();
    }
}
