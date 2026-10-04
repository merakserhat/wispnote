package com.wispnote.backend.infrastructure.converter;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.auth.model.WispnoteAccessToken;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.UUID;

public class WispnoteAccessTokenConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public WispnoteAccessToken convert(Jwt jwt) {
        var authorities = new JwtGrantedAuthoritiesConverter().convert(jwt);

        var userDetails = CustomUserDetails.builder()
                .id(UUID.fromString(jwt.getClaimAsString("id")))
                .username(jwt.getSubject())
                .grantedAuthorities(authorities)
                .build();

        return new WispnoteAccessToken(jwt, userDetails, authorities);
    }
}