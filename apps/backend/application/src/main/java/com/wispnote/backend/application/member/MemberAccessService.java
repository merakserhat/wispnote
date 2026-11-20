package com.wispnote.backend.application.member;

import com.wispnote.backend.application.feature.enums.FeatureType;
import com.wispnote.backend.application.feature.port.FeaturePort;
import com.wispnote.backend.application.member.enums.MemberAccessStatus;
import com.wispnote.backend.application.member.exception.AccessPendingValidationException;
import com.wispnote.backend.application.member.exception.AccessRejectedValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberAccessService {

    private final FeaturePort featurePort;

    public MemberAccessStatus resolveInitialStatus() {
        if (featurePort.isEnabled(FeatureType.ADMIN_APPROVAL_REQUIRED)) {
            return MemberAccessStatus.PENDING;
        }

        return MemberAccessStatus.APPROVED;
    }

    public void assertCanSignIn(UUID memberId, MemberAccessStatus accessStatus) {
        if (accessStatus == MemberAccessStatus.PENDING) {
            log.info("Sign in rejected, access is pending for {}", kv("memberId", memberId));
            throw new AccessPendingValidationException();
        }

        if (accessStatus == MemberAccessStatus.REJECTED) {
            log.info("Sign in rejected, access is rejected for {}", kv("memberId", memberId));
            throw new AccessRejectedValidationException();
        }
    }
}
