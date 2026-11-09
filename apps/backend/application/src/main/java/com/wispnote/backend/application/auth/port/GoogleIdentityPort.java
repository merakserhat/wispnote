package com.wispnote.backend.application.auth.port;

import com.wispnote.backend.application.auth.model.GoogleIdentity;

public interface GoogleIdentityPort {
    GoogleIdentity exchange(String code, String codeVerifier, String redirectUri);
}
