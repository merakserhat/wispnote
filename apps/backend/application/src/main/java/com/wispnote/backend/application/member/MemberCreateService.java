package com.wispnote.backend.application.member;

import com.wispnote.backend.application.member.exception.EmailAlreadyUsedValidationException;
import com.wispnote.backend.application.member.model.Member;
import com.wispnote.backend.application.member.port.MemberPort;
import com.wispnote.backend.application.auth.port.PasswordHasherPort;
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
