package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Immeuble;

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
public class ImmeubleDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String codeNomAbrvImmeuble;
    String nomCompletImmeuble;
    String nomBaptiserImmeuble;
    String descriptionImmeuble;
    int numImmeuble;
    int nbrEtage;
    int nbrePiecesDansImmeuble;
    boolean isGarrage;

    Long idSite;
    Long idUtilisateur;


    public static ImmeubleDto fromEntity(Immeuble immeuble) {
        if (immeuble == null) {
            return null;
        }
        return ImmeubleDto.builder()
                .id(immeuble.getId())
                .idAgence(immeuble.getIdAgence())
                .idCreateur(immeuble.getIdCreateur())
                .codeNomAbrvImmeuble(immeuble.getCodeNomAbrvImmeuble())
                .nomCompletImmeuble(immeuble.getNomBaptiserImmeuble())
                .nomBaptiserImmeuble(immeuble.getNomBaptiserImmeuble())
                .descriptionImmeuble(immeuble.getDescriptionImmeuble())
                .numImmeuble(immeuble.getNumImmeuble())
                .nbrEtage(immeuble.getNbrEtage())
                .nbrePiecesDansImmeuble(immeuble.getNbrePiecesDansImmeuble())
                .isGarrage(immeuble.isGarrage())
                .idSite(immeuble.getSite().getId())
                .idUtilisateur(immeuble.getUtilisateurProprietaire().getId())
                .build();
    }

}
