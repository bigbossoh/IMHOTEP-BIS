package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Magasin;

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
public class MagasinResponseDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    int nombrePieceMagasin;
    Long numMagasin;
    boolean isUnderBuildingMagasin;
    String codeAbrvBienImmobilier;
    String nomCompletBienImmobilier;
    String nomBaptiserBienImmobilier;
    String description;
    double superficieBien;
    boolean bienMeublerResidence;
    boolean isOccupied;
    String proprietaire;
    public static MagasinResponseDto fromEntity(Magasin magasin) {
        if (magasin == null) {
            return null;
        }

        return MagasinResponseDto.builder()
                .id(magasin.getId())
                .idAgence(magasin.getIdAgence())
                .idCreateur(magasin.getIdCreateur())
                .nombrePieceMagasin(magasin.getNombrePieceMagasin())
                .numMagasin(magasin.getNumMagasin())
                .isUnderBuildingMagasin(magasin.isUnderBuildingMagasin())
                .codeAbrvBienImmobilier(magasin.getCodeAbrvBienImmobilier())
                .description(magasin.getDescription())
                .nomCompletBienImmobilier(magasin.getNomCompletBienImmobilier())
                .superficieBien(magasin.getSuperficieBien())
                .isOccupied(magasin.isOccupied())
                .nomBaptiserBienImmobilier(magasin.getNomBaptiserBienImmobilier())
                .bienMeublerResidence(magasin.isBienMeublerResidence())
                .proprietaire(magasin.getUtilisateurProprietaire().getNom()+" "+(magasin.getUtilisateurProprietaire().getPrenom()))
                .build();
    }
}
