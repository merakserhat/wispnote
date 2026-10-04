package com.wispnote.backend.infrastructure.security.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.wispnote.backend.infrastructure.properties.RsaKeyProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.token.JwtGenerator;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(RsaKeyProperties.class)
public class JwtConfiguration {

    private static final String ACCESS_TOKEN_KEY_ID = "access-token";

    private final RsaKeyProperties rsaKeyProperties;

    @Bean
    public JWKSource<SecurityContext> accessTokenJwkSource() {
        var rsaKey = new RSAKey.Builder(rsaKeyProperties.accessToken().publicKey())
                .privateKey(rsaKeyProperties.accessToken().privateKey())
                .keyID(ACCESS_TOKEN_KEY_ID)
                .build();

        return new ImmutableJWKSet<>(new JWKSet(rsaKey));
    }

    @Bean
    public OAuth2TokenGenerator<?> clientTokenGenerator(JWKSource<SecurityContext> accessTokenJwkSource) {
        return new JwtGenerator(new NimbusJwtEncoder(accessTokenJwkSource));
    }

    @Bean
    public JwtEncoder accessTokenJwtEncoder() {
        return NimbusJwtEncoder
                .withKeyPair(rsaKeyProperties.accessToken().publicKey(), rsaKeyProperties.accessToken().privateKey())
                .build();
    }

    @Bean
    public JwtDecoder accessTokenJwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaKeyProperties.accessToken().publicKey()).build();
    }

    @Bean
    public JwtEncoder refreshTokenJwtEncoder() {
        return NimbusJwtEncoder
                .withKeyPair(rsaKeyProperties.refreshToken().publicKey(), rsaKeyProperties.refreshToken().privateKey())
                .build();
    }

    @Bean
    public JwtDecoder refreshTokenJwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaKeyProperties.refreshToken().publicKey()).build();
    }
}
