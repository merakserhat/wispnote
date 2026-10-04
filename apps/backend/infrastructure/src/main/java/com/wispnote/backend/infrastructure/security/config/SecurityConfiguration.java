package com.wispnote.backend.infrastructure.security.config;

import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.wispnote.backend.infrastructure.converter.WispnoteAccessTokenConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.authorization.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private static final String SCOPE_USER = "SCOPE_USER";
    private static final String SCOPE_SERVICE = "SCOPE_SERVICE";

    private final JwtDecoder accessTokenJwtDecoder;
    private final JWKSource<SecurityContext> accessTokenJwkSource;
    private final OAuth2TokenGenerator<?> clientTokenGenerator;

    @Bean
    @Order(0)
    public SecurityFilterChain authorizationServerEndpoints(HttpSecurity http) throws Exception {
        var authorizationServerConfigurer = new OAuth2AuthorizationServerConfigurer();
        http.setSharedObject(JWKSource.class, accessTokenJwkSource);

        return hardened(http.securityMatcher(authorizationServerConfigurer.getEndpointsMatcher()))
                .with(authorizationServerConfigurer, authorizationServer -> authorizationServer
                        .tokenGenerator(clientTokenGenerator))
                .build();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain publicEndpoints(HttpSecurity http) throws Exception {
        return hardened(http.securityMatcher("/v1/register", "/v1/login", "/v1/refresh", "/actuator/**", "/error"))
                .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
                .oauth2ResourceServer(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain internalEndpoints(HttpSecurity http) throws Exception {
        return hardened(http.securityMatcher("/internal/**"))
                .authorizeHttpRequests(authorize -> authorize.anyRequest().hasAuthority(SCOPE_SERVICE))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(accessTokenJwtDecoder)
                                .jwtAuthenticationConverter(new JwtAuthenticationConverter())))
                .build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain protectedEndpoints(HttpSecurity http) throws Exception {
        return hardened(http.securityMatcher("/**"))
                .authorizeHttpRequests(authorize -> authorize.anyRequest().hasAuthority(SCOPE_USER))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(accessTokenJwtDecoder)
                                .jwtAuthenticationConverter(new WispnoteAccessTokenConverter())))
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private HttpSecurity hardened(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .anonymous(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .sessionManagement(AbstractHttpConfigurer::disable);
    }
}
