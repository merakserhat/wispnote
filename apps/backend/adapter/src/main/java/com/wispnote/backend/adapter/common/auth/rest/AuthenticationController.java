package com.wispnote.backend.adapter.common.auth.rest;

import com.wispnote.backend.adapter.common.auth.rest.request.LoginRequest;
import com.wispnote.backend.adapter.common.auth.rest.request.RegisterRequest;
import com.wispnote.backend.adapter.common.auth.rest.response.TokenResponse;
import com.wispnote.backend.adapter.common.member.rest.response.MemberResponse;
import com.wispnote.backend.application.common.auth.LoginFacade;
import com.wispnote.backend.application.common.auth.RegisterFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
public class AuthenticationController {

    private final LoginFacade loginFacade;
    private final RegisterFacade registerFacade;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody @Valid LoginRequest request) {
        return TokenResponse.from(loginFacade.login(request.getEmail(), request.getPassword()));
    }

    @PostMapping("/register")
    public MemberResponse register(@RequestBody @Valid RegisterRequest request) {
        var member = registerFacade.register(request.getEmail(), request.getPassword(), request.getPasswordConfirm());

        return new MemberResponse(member.id(), member.email());
    }
}
