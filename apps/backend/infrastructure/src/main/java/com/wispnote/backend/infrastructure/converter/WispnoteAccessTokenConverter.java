package com.wispnote.backend.infrastructure.converter;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.auth.model.WispnoteAccessToken;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Optional;
import java.util.UUID;

public class WispnoteAccessTokenConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String MEMBER_ID_CLAIM = "id";

    @Override
    public WispnoteAccessToken convert(Jwt jwt) {
        var memberId = Optional.ofNullable(jwt.getClaimAsString(MEMBER_ID_CLAIM))
                .map(UUID::fromString)
                .orElse(null);

        var authorities = new JwtGrantedAuthoritiesConverter().convert(jwt);

        var userDetails = CustomUserDetails.builder()
                .id(memberId)
                .username(jwt.getSubject())
                .grantedAuthorities(authorities)
                .build();

        return new WispnoteAccessToken(jwt, userDetails, authorities);
    }
}
