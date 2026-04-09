package com.bzdata.gestimospringbackend.user.dto.response;

import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublicUtilisateurDto {

  Long id;
  Long idAgence;
  Long idCreateur;
  String nom;
  String prenom;
  String email;
  String mobile;
  String roleUsed;
  boolean isActivated;
  boolean isActive;
  boolean isNonLocked;

  public static PublicUtilisateurDto fromEntity(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return null;
    }

    return PublicUtilisateurDto
      .builder()
      .id(utilisateur.getId())
      .idAgence(utilisateur.getIdAgence())
      .idCreateur(utilisateur.getIdCreateur())
      .nom(utilisateur.getNom())
      .prenom(utilisateur.getPrenom())
      .email(utilisateur.getEmail())
      .mobile(utilisateur.getMobile())
      .roleUsed(utilisateur.getRoleUsed())
      .isActivated(utilisateur.isActivated())
      .isActive(utilisateur.isActive())
      .isNonLocked(utilisateur.isNonLocked())
      .build();
  }
}
