package com.wispnote.backend.application.common.member;

import com.wispnote.backend.application.common.exception.EmailAlreadyUsedValidationException;
import com.wispnote.backend.application.common.member.model.Member;
import com.wispnote.backend.application.common.member.port.MemberPort;
import com.wispnote.backend.application.common.auth.port.PasswordHasherPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberCreateService {

    private final MemberPort memberPort;
    private final PasswordHasherPort passwordHasherPort;

    public Member create(String email, String rawPassword) {
        if (memberPort.existsByEmail(email)) {
            throw new EmailAlreadyUsedValidationException();
        }

        return memberPort.create(email, passwordHasherPort.hash(rawPassword));
    }
}
