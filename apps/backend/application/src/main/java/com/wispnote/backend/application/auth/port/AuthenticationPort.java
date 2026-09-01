package com.wispnote.backend.application.auth.port;

import com.wispnote.backend.application.auth.model.AuthenticatedUser;

public interface AuthenticationPort {
    AuthenticatedUser authenticate(String email, String password);
}

