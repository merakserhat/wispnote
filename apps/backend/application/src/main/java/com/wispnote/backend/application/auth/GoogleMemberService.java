package com.wispnote.backend.application.auth;

import com.wispnote.backend.application.auth.model.GoogleIdentity;
import com.wispnote.backend.application.emailverification.service.EmailVerificationService;
import com.wispnote.backend.application.member.model.Member;
import com.wispnote.backend.application.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleMemberService {

    private final MemberPort memberPort;
    private final EmailVerificationService emailVerificationService;

    @Transactional
    public Member resolve(GoogleIdentity identity) {
        return memberPort.findByGoogleId(identity.subject())
                .orElseGet(() -> linkOrCreate(identity));
    }

    private Member linkOrCreate(GoogleIdentity identity) {
        var existing = memberPort.findByEmail(identity.email());

        if (existing.isPresent() && existing.get().isEmailVerified()) {
            log.info("Linking Google account to member {}", kv("memberId", existing.get().id()));
            memberPort.linkGoogle(existing.get().id(), identity.subject());
            return existing.get();
        }

        existing.ifPresent(unverified -> {
            log.info("Replacing unverified member {}", kv("memberId", unverified.id()));
            emailVerificationService.invalidatePending(unverified.id());
            memberPort.delete(unverified.id());
        });

        log.info("Creating member from Google account {}", kv("email", identity.email()));
        return memberPort.createWithGoogle(identity.email(), identity.subject(), Instant.now());
    }
}
