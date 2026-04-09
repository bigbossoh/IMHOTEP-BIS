package com.bzdata.gestimospringbackend.user.dto.response;

import com.bzdata.gestimospringbackend.DTOs.RoleRequestDto;
import java.time.LocalDate;
import java.util.Date;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class  UtilisateurAfficheDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String utilisateurIdApp;
    String nom;
    String prenom;
    String email;
    String mobile;
    LocalDate dateDeNaissance;
    String lieuNaissance;
    String typePieceIdentite;
    String numeroPieceIdentite;
    LocalDate dateDebutPiece;
    LocalDate dateFinPiece;
    String nationalite;
    String genre;
    boolean isActivated;

    String username;
    String password;

    String profileImageUrl;
    Date lastLoginDate;
    Date lastLoginDateDisplay;
    Date joinDate;
    String roleUsed;
    String[] authorities;
    boolean isActive;
    boolean isNonLocked;
    Boolean hasActiveBail;
    Boolean canBeDeleted;

    Long agenceDto;
    RoleRequestDto roleRequestDto;
    Long userCreate;
}
