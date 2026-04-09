package com.bzdata.gestimospringbackend.user.repository;

import com.bzdata.gestimospringbackend.user.entity.PasswordResetToken;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository
  extends JpaRepository<PasswordResetToken, Long> {
  Optional<PasswordResetToken> findByToken(String token);

  List<PasswordResetToken> findAllByUtilisateurAndUsedFalse(Utilisateur utilisateur);
}
