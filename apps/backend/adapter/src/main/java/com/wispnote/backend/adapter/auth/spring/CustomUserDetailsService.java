package com.wispnote.backend.adapter.auth.spring;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.application.member.port.MemberPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberPort memberPort;

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var member = memberPort.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Not Found " + email));

        return CustomUserDetails.builder()
                .id(member.id())
                .username(member.email())
                .password(member.passwordHash())
                .grantedAuthorities(List.of())
                .build();
    }
}
