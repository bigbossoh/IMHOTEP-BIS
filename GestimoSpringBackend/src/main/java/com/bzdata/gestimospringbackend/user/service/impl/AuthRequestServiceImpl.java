package com.bzdata.gestimospringbackend.user.service.impl;

import java.util.List;

import com.bzdata.gestimospringbackend.user.dto.request.AuthRequestDto;
import com.bzdata.gestimospringbackend.user.dto.response.AuthResponseDto;
import com.bzdata.gestimospringbackend.common.security.model.UserPrincipal;
import com.bzdata.gestimospringbackend.user.service.AuthRequestService;
import com.bzdata.gestimospringbackend.common.security.service.ApplicationUserDetailsService;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.common.security.provider.JWTTokenProvider;
import com.bzdata.gestimospringbackend.user.validator.AuthRequestDtoValidator;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
public class AuthRequestServiceImpl implements AuthRequestService {

    private final AuthenticationManager authenticationManager;

    private final ApplicationUserDetailsService userDetailsService;

    private final JWTTokenProvider jwtTokenProvider;

    @Override
    public AuthResponseDto authenticate(AuthRequestDto dto) {

        log.info("We are going to login into the system {}", dto);
        List<String> errors = AuthRequestDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Les informations fournies par l'utilisateur ne sont pas valide {}", errors);
            throw new InvalidEntityException("Les informations fournies par l'utilisateur ne sont pas valide",
                    ErrorCodes.UTILISATEUR_NOT_VALID, errors);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()));
        final UserPrincipal userDetails = (UserPrincipal) userDetailsService.loadUserByUsername(dto.getUsername());

        final String jwt = jwtTokenProvider.generateJwtToken(userDetails);

        return AuthResponseDto.builder().accessToken(jwt).build();

    }

}
