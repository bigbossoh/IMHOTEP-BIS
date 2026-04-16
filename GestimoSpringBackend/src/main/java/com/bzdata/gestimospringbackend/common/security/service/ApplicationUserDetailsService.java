package com.bzdata.gestimospringbackend.common.security.service;

import static com.bzdata.gestimospringbackend.common.constant.UserImplConstant.NO_USER_FOUND_BY_USERNAME;

import com.bzdata.gestimospringbackend.common.security.model.UserPrincipal;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    String normalizedEmail = email == null ? "" : email.trim();
    List<Utilisateur> matches = utilisateurRepository.findAllByEmail(normalizedEmail);
    Optional<Utilisateur> selected = pickPreferredUtilisateur(matches);
    Utilisateur utilisateur = selected.orElseThrow(() ->
      new UsernameNotFoundException(NO_USER_FOUND_BY_USERNAME + email)
    );

    if (matches.size() > 1) {
      log.warn(
        "Plusieurs utilisateurs trouvÃ©s pour l'email {} ({}). Utilisation de l'id {}.",
        normalizedEmail,
        matches.size(),
        utilisateur.getId()
      );
    }

    validateLoginAttempt(utilisateur);
    utilisateurRepository.save(utilisateur);

    UserPrincipal userPrincipal = new UserPrincipal(utilisateur);
    log.info("Utilisateur trouvÃ©: email={}", utilisateur.getEmail());
    return userPrincipal;
  }

  private Optional<Utilisateur> pickPreferredUtilisateur(List<Utilisateur> candidats) {
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
