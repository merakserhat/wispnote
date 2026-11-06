package com.wispnote.analyzer.infrastructure.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private static final String SCOPE_SERVICE = "SCOPE_SERVICE";

    @Bean
    @Order(0)
    public SecurityFilterChain internalEndpoints(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {
        return hardened(http.securityMatcher("/internal/**"))
                .authorizeHttpRequests(authorize -> authorize.anyRequest().hasAuthority(SCOPE_SERVICE))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder)
                                .jwtAuthenticationConverter(new JwtAuthenticationConverter())))
                .build();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain publicEndpoints(HttpSecurity http) throws Exception {
        return hardened(http.securityMatcher("/**"))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/actuator/**").permitAll()
                        .anyRequest().denyAll())
                .oauth2ResourceServer(AbstractHttpConfigurer::disable)
                .build();
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
