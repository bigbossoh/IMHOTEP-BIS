package com.bzdata.gestimospringbackend.DTOs;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder

@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImmeubleResponseDto {
//    Long id;
//    Long numBien;
//    Long idAgence;
//    String statutBien;
//    String denominationBien;
//    String nomBien;
//    String etatBien;
//    double superficieBien;
//    boolean isOccupied;
//
//    Long idSite;
//    Long idUtilisateur;
//
//    int nbrEtage;
//    int nbrePieceImmeuble;
//    String abrvNomImmeuble;
//    String descriptionImmeuble;
//    int numeroImmeuble;
//    boolean isGarrage;
//
//    public static ImmeubleDto fromEntity(Immeuble immeuble) {
//        if (immeuble == null) {
//            return null;
//        }
//        return ImmeubleDto.builder()
//                .id(immeuble.getId())
//                .abrvNomImmeuble(immeuble.getAbrvNomImmeuble())
//                // .denominationBien(immeuble.getDenominationBien())
//                .descriptionImmeuble(immeuble.getDescriptionImmeuble())
//                // .denominationBien(immeuble.getDenominationBien())
//                // .etatBien(immeuble.getEtatBien())
//                .idAgence(immeuble.getIdAgence())
//                .isGarrage(immeuble.isGarrage())
//                .isOccupied(immeuble.isOccupied())
//                .nbrEtage(immeuble.getNbrEtage())
//                .nbrePieceImmeuble(immeuble.getNbrePieceImmeuble())
//                .nomBien(immeuble.getNomBien())
//                .numBien(immeuble.getNumBien())
//                .numeroImmeuble(immeuble.getNumeroImmeuble())
//                .idSite(immeuble.getSite().getId())
//                .idUtilisateur(immeuble.getUtilisateur().getId())
//                .build();
//    }

}
