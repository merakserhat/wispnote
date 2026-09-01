package com.wispnote.backend.adapter.common.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;

@Getter
@Setter
public class WispnoteAccessToken extends JwtAuthenticationToken {

    private CustomUserDetails customUserDetails;

    public WispnoteAccessToken(Jwt jwt,
                               CustomUserDetails customUserDetails,
                               Collection<? extends GrantedAuthority> authorities) {
        super(jwt, authorities);
        this.customUserDetails = customUserDetails;
    }

    @Override
    public Object getPrincipal() {
        return customUserDetails;
    }
}
