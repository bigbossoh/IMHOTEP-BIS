package com.bzdata.gestimospringbackend.common.security.service;

import static com.bzdata.gestimospringbackend.common.constant.UserImplConstant.NO_USER_FOUND_BY_USERNAME;

import com.bzdata.gestimospringbackend.common.security.model.UserPrincipal;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserDetailsService implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;
    private final LoginAttemptService loginAttemptService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Chargement utilisateur par email: {}", email);
        Utilisateur utilisateur = utilisateurRepository.findUtilisateurByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(NO_USER_FOUND_BY_USERNAME + email));
        validateLoginAttempt(utilisateur);
        utilisateurRepository.save(utilisateur);
        UserPrincipal userPrincipal = new UserPrincipal(utilisateur);
        log.info("Utilisateur trouvé: email={}", utilisateur.getEmail());
        return userPrincipal;
    }

    private void validateLoginAttempt(Utilisateur user) {
        if (user.isNonLocked()) {
            if (loginAttemptService.hasExceededMaxAttempts(user.getEmail())) {
                user.setNonLocked(false);
            } else {
                user.setNonLocked(true);
            }
        } else {
            loginAttemptService.evictUserFromLoginAttemptCache(user.getEmail());
        }
    }
}
