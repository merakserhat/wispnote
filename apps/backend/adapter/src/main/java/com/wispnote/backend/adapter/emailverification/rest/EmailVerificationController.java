package com.wispnote.backend.adapter.emailverification.rest;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.auth.rest.response.TokenResponse;
import com.wispnote.backend.adapter.emailverification.rest.request.EmailVerificationConfirmRequest;
import com.wispnote.backend.adapter.emailverification.rest.response.EmailVerificationResendResponse;
import com.wispnote.backend.application.emailverification.EmailVerificationFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/email-verification")
public class EmailVerificationController {

    private final EmailVerificationFacade emailVerificationFacade;

    @PostMapping("/confirm")
    public TokenResponse confirm(@AuthenticationPrincipal CustomUserDetails userDetail,
                                 @RequestBody @Valid EmailVerificationConfirmRequest request) {
        var result = emailVerificationFacade.confirm(userDetail.getId(), request.getCode());

        return TokenResponse.from(result);
    }

    @PostMapping("/resend")
    public EmailVerificationResendResponse resend(@AuthenticationPrincipal CustomUserDetails userDetail) {
        var result = emailVerificationFacade.resend(userDetail.getId());

        return EmailVerificationResendResponse.from(result);
    }
}
