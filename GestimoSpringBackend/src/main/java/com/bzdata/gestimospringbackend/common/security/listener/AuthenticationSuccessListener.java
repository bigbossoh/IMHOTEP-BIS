package com.bzdata.gestimospringbackend.common.security.listener;

import com.bzdata.gestimospringbackend.common.security.model.UserPrincipal;
import com.bzdata.gestimospringbackend.common.security.service.LoginAttemptService;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
            List<Utilisateur> matches = utilisateurRepository.findAllByEmail(
              user.getUsername()
            );
            Optional<Utilisateur> selected = pickPreferredUtilisateur(
              matches
            );
            selected.ifPresent(utilisateur -> {
                utilisateur.setLastLoginDateDisplay(utilisateur.getLastLoginDate());
                utilisateur.setLastLoginDate(new Date());
                utilisateurRepository.save(utilisateur);
            });
        }
    }

    private Optional<Utilisateur> pickPreferredUtilisateur(
      List<Utilisateur> candidats
    ) {
        if (candidats == null || candidats.isEmpty()) {
            return Optional.empty();
        }

        return candidats
          .stream()
          .filter(Objects::nonNull)
          .sorted(
            Comparator
              .comparing((Utilisateur utilisateur) -> utilisateur.isActive() ? 0 : 1)
              .thenComparing(utilisateur -> utilisateur.isNonLocked() ? 0 : 1)
              .thenComparing(utilisateur -> utilisateur.isActivated() ? 0 : 1)
              .thenComparing(
                Utilisateur::getLastLoginDate,
                Comparator.nullsLast(Comparator.reverseOrder())
              )
              .thenComparing(
                Utilisateur::getJoinDate,
                Comparator.nullsLast(Comparator.reverseOrder())
              )
              .thenComparing(
                Utilisateur::getId,
                Comparator.nullsLast(Comparator.reverseOrder())
              )
          )
          .findFirst();
    }
}
