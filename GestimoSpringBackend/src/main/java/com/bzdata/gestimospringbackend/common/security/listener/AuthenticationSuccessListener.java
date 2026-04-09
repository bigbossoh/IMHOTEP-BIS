package com.bzdata.gestimospringbackend.common.security.listener;

import com.bzdata.gestimospringbackend.common.security.model.UserPrincipal;
import com.bzdata.gestimospringbackend.common.security.service.LoginAttemptService;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.util.Date;
import lombok.AllArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AuthenticationSuccessListener {
    private final LoginAttemptService loginAttemptService;
    private final UtilisateurRepository utilisateurRepository;

    @EventListener
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        Object principal = event.getAuthentication().getPrincipal();
        if(principal instanceof UserPrincipal) {
            UserPrincipal user = (UserPrincipal) event.getAuthentication().getPrincipal();
            loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
            utilisateurRepository.findUtilisateurByEmail(user.getUsername()).ifPresent(utilisateur -> {
                utilisateur.setLastLoginDateDisplay(utilisateur.getLastLoginDate());
                utilisateur.setLastLoginDate(new Date());
                utilisateurRepository.save(utilisateur);
            });
        }
    }
}
