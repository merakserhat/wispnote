package com.wispnote.backend.adapter.emailverification.converter;

import com.wispnote.backend.adapter.common.converter.BaseEnumConverter;
import com.wispnote.backend.application.emailverification.enums.EmailVerificationStatus;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class EmailVerificationStatusConverter {
    public static final BaseEnumConverter<EmailVerificationStatus, String> jpa = new BaseEnumConverter<>(Map.of(
            EmailVerificationStatus.PENDING, "pending",
            EmailVerificationStatus.CONFIRMED, "confirmed",
            EmailVerificationStatus.EXPIRED, "expired",
            EmailVerificationStatus.INVALIDATED, "invalidated"
    ));
}
