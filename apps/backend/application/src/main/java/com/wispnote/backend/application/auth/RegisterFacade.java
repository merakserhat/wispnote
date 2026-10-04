package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.exception.PasswordDidntMatchWithConfirmValidationException;
import com.wispnote.backend.application.member.MemberCreateService;
import com.wispnote.backend.application.member.model.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterFacade {

    private final MemberCreateService memberCreateService;

    public Member register(String email, String password, String passwordConfirm) {
        log.info("Register started for {}", kv("email", email));

        if (!password.equals(passwordConfirm)) {
            throw new PasswordDidntMatchWithConfirmValidationException();
        }

        return memberCreateService.create(email, password);
    }
}
