package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Bienimmobilier;

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
public class BienImmobilierDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String codeAbrvBienImmobilier;
    String nomCompletBienImmobilier;
    String nomBaptiserBienImmobilier;
    String description;
    double superficieBien;
    boolean bienMeublerResidence;
    boolean isOccupied;
    String utilisateur;
    public static BienImmobilierDto fromEntity(Bienimmobilier bienimmobilier) {
        if (bienimmobilier == null) {
            return null;
        }
        return BienImmobilierDto.builder()
                .id(bienimmobilier.getId())
                .idAgence(bienimmobilier.getIdAgence())
                .idCreateur(bienimmobilier.getIdCreateur())
                .codeAbrvBienImmobilier(bienimmobilier.getCodeAbrvBienImmobilier())
                .description(bienimmobilier.getDescription())
                .nomCompletBienImmobilier(bienimmobilier.getNomCompletBienImmobilier())
                .isOccupied(bienimmobilier.isOccupied())
                .nomBaptiserBienImmobilier(bienimmobilier.getNomBaptiserBienImmobilier())
                .superficieBien(bienimmobilier.getSuperficieBien())
                .utilisateur(bienimmobilier.getUtilisateurProprietaire().getNom() + " " +
                        bienimmobilier.getUtilisateurProprietaire().getPrenom())

                .build();
    }
}
