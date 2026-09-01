package com.wispnote.backend.application.common.auth.port;

import com.wispnote.backend.application.common.auth.model.AuthenticatedUser;

public interface AuthenticationPort {
    AuthenticatedUser authenticate(String email, String password);
}

