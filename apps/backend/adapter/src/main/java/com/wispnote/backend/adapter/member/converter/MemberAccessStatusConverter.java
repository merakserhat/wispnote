package com.wispnote.backend.adapter.member.converter;

import com.wispnote.backend.adapter.common.converter.BaseEnumConverter;
import com.wispnote.backend.application.member.enums.MemberAccessStatus;
import lombok.NoArgsConstructor;

import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class MemberAccessStatusConverter {
    public static final BaseEnumConverter<MemberAccessStatus, String> jpa = new BaseEnumConverter<>(Map.of(
            MemberAccessStatus.PENDING, "pending",
            MemberAccessStatus.APPROVED, "approved",
            MemberAccessStatus.REJECTED, "rejected"
    ));
}
