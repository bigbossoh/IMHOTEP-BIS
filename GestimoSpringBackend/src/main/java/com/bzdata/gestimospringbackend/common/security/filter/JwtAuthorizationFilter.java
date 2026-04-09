package com.bzdata.gestimospringbackend.common.security.filter;

import com.auth0.jwt.interfaces.Claim;
import com.bzdata.gestimospringbackend.common.security.provider.JWTTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.TOKEN_PREFIX;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.OK;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.OPTIONS_HTTP_METHOD;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JWTTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        Claim idAgence = null;
        if (request.getMethod().equalsIgnoreCase(OPTIONS_HTTP_METHOD)) {
            response.setStatus(OK.value());
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            if (authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_PREFIX)) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authorizationHeader.substring(TOKEN_PREFIX.length());
            String username = jwtTokenProvider.getSubject(token);
            idAgence = jwtTokenProvider.extractIdAgnece(token);

            String agencyValue = claimAsString(idAgence);
            if (agencyValue != null) {
                MDC.put("idAgence", agencyValue);
            }

            if (
                jwtTokenProvider.isTokenValid(username, token) &&
                SecurityContextHolder.getContext().getAuthentication() == null
            ) {
                List<GrantedAuthority> authorities = jwtTokenProvider.getAuthorities(token);
                Authentication authentication = jwtTokenProvider.getAuthentication(
                    username,
                    authorities,
                    request
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                SecurityContextHolder.clearContext();
            }

            filterChain.doFilter(request, response);
        } finally {
            if (idAgence != null) {
                MDC.remove("idAgence");
            }
        }
    }

    private String claimAsString(Claim claim) {
        if (claim == null || claim.isNull()) {
            return null;
        }

        String value = claim.asString();
        if (value != null) {
            return value;
        }

        Long longValue = claim.asLong();
        if (longValue != null) {
            return String.valueOf(longValue);
        }

        Integer intValue = claim.asInt();
        return intValue != null ? String.valueOf(intValue) : null;
    }
}
