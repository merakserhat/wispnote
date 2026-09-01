package com.wispnote.backend.infrastructure.security.config;

import com.wispnote.backend.infrastructure.properties.RsaKeyProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(RsaKeyProperties.class)
public class JwtConfiguration {

    private final RsaKeyProperties rsaKeyProperties;

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
}