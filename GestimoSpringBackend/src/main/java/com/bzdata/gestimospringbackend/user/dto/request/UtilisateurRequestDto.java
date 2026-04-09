package com.bzdata.gestimospringbackend.user.dto.request;

import com.bzdata.gestimospringbackend.DTOs.RoleRequestDto;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.time.LocalDate;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurRequestDto {

  private Long id;
  Long idAgence;
  Long idCreateur;
  private String utilisateurIdApp;
  private String nom;
  private String prenom;
  private String email;
  private String mobile;
  private LocalDate dateDeNaissance;
  private String lieuNaissance;
  private String typePieceIdentite;
  private String numeroPieceIdentite;
  private LocalDate dateDebutPiece;
  private LocalDate dateFinPiece;
  private String nationalite;
  private String genre;
  private boolean isActivated;

  private String username;
  private String password;

  private String profileImageUrl;
  private Date lastLoginDate;
  private Date lastLoginDateDisplay;
  private Date joinDate;
  private String roleUsed;
  private String[] authorities;
  private boolean isActive;
  private boolean isNonLocked;

  Long agenceDto;
  RoleRequestDto roleRequestDto;
  Long userCreate;
  Long idEtablissement;

  public static UtilisateurRequestDto fromEntity(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return null;
    }
    return UtilisateurRequestDto
      .builder()
      .id(utilisateur.getId())
      .idAgence(utilisateur.getIdAgence())
      .utilisateurIdApp(utilisateur.getUtilisateurIdApp())
      .nom(utilisateur.getNom())
      .prenom(utilisateur.getPrenom())
      .email(utilisateur.getEmail())
      .mobile(utilisateur.getMobile())
      .dateDeNaissance(utilisateur.getDateDeNaissance())
      .lieuNaissance(utilisateur.getLieuNaissance())
      .typePieceIdentite(utilisateur.getTypePieceIdentite())
      .numeroPieceIdentite(utilisateur.getNumeroPieceIdentite())
      .dateDebutPiece(utilisateur.getDateDebutPiece())
      .dateFinPiece(utilisateur.getDateFinPiece())
      .nationalite(utilisateur.getNationalite())
      .genre(utilisateur.getGenre())
      .isActivated(utilisateur.isActivated())
      .username(utilisateur.getUsername())
      .password(utilisateur.getPassword())
      .profileImageUrl(utilisateur.getProfileImageUrl())
      .lastLoginDate(utilisateur.getLastLoginDate())
      .lastLoginDateDisplay(utilisateur.getLastLoginDateDisplay())
      .joinDate(utilisateur.getJoinDate())
      .roleUsed(utilisateur.getRoleUsed())
      .authorities(utilisateur.getAuthorities())
      .isActive(utilisateur.isActive())
      .isNonLocked(utilisateur.isNonLocked())
      // .agenceDto(AgenceRequestDto.fromEntity(utilisateur.getAgence()))
      .roleRequestDto(RoleRequestDto.fromEntity(utilisateur.getUrole()))
      .userCreate(utilisateur.getId())
      .build();
  }

  public static Utilisateur toEntity(UtilisateurRequestDto dto) {
    if (dto == null) {
      return null;
    }

    Utilisateur newUtilisateur = new Utilisateur();

    newUtilisateur.setId(dto.getId());
    newUtilisateur.setUtilisateurIdApp(dto.getUtilisateurIdApp());
    newUtilisateur.setNom(dto.getNom());
    newUtilisateur.setPrenom(dto.getPrenom());
    newUtilisateur.setEmail(dto.getEmail());
    newUtilisateur.setMobile(dto.getMobile());
    newUtilisateur.setDateDeNaissance(dto.getDateDeNaissance());
    newUtilisateur.setLieuNaissance(dto.getLieuNaissance());
    newUtilisateur.setTypePieceIdentite(dto.getTypePieceIdentite());
    newUtilisateur.setNumeroPieceIdentite(dto.getNumeroPieceIdentite());
    newUtilisateur.setDateFinPiece(dto.getDateFinPiece());
    newUtilisateur.setDateDebutPiece(dto.getDateDebutPiece());
    newUtilisateur.setNationalite(dto.getNationalite());
    newUtilisateur.setGenre(dto.getGenre());
    newUtilisateur.setActivated(dto.isActivated());
    newUtilisateur.setUsername(dto.getUsername());
    newUtilisateur.setPassword(dto.getPassword());
    newUtilisateur.setIdAgence(dto.getIdAgence());
    newUtilisateur.setProfileImageUrl(dto.getProfileImageUrl());
    newUtilisateur.setLastLoginDate(dto.getLastLoginDate());
    newUtilisateur.setLastLoginDateDisplay(dto.getLastLoginDateDisplay());
    newUtilisateur.setJoinDate(dto.getJoinDate());
    newUtilisateur.setRoleUsed(dto.getRoleUsed());
    newUtilisateur.setAuthorities(dto.getAuthorities());
    newUtilisateur.setActive(dto.isActive());
    newUtilisateur.setNonLocked(dto.isNonLocked());
    // newUtilisateur.setAgence(AgenceRequestDto.toEntity(dto.getAgenceDto()));
    newUtilisateur.setUrole(RoleRequestDto.toEntity(dto.getRoleRequestDto()));
    // newUtilisateur.setUserCreate(dto.getUserCreate());

    return newUtilisateur;
  }
}
