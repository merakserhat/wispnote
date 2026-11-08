package com.wispnote.backend.adapter.auth.rest.response;

import com.wispnote.backend.application.auth.model.RegisterResult;

import java.util.UUID;

public record RegisterResponse(UUID id,
                               String email,
                               String verificationToken,
                               Integer verificationTokenExpiresIn,
                               Integer codeExpiresIn) {

    public static RegisterResponse from(RegisterResult result) {
        return new RegisterResponse(
                result.member().id(),
                result.member().email(),
                result.verificationToken().token(),
                result.verificationToken().expiresIn(),
                result.codeExpiresInSeconds());
    }
}
