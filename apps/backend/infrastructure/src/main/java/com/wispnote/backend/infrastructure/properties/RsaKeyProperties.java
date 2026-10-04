package com.wispnote.backend.infrastructure.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@ConfigurationProperties(prefix = "rsa")
public record RsaKeyProperties(AccessToken accessToken, RefreshToken refreshToken) {

    public record AccessToken(RSAPublicKey publicKey, RSAPrivateKey privateKey) {
    }

    public record RefreshToken(RSAPublicKey publicKey, RSAPrivateKey privateKey) {
    }
}
