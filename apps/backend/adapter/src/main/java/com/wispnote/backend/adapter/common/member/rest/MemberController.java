package com.wispnote.backend.adapter.common.member.rest;

import com.wispnote.backend.adapter.common.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.common.member.rest.response.MemberResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/members")
public class MemberController {

    @GetMapping("/me")
    public MemberResponse me(@AuthenticationPrincipal CustomUserDetails userDetail) {
        return new MemberResponse(userDetail.getId(), userDetail.getUsername());
    }
}
