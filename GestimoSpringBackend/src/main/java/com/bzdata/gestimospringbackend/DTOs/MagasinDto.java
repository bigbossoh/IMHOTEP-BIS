package com.bzdata.gestimospringbackend.DTOs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MagasinDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    int nombrePieceMagasin;
    Long numMagasin;
    String codeAbrvBienImmobilier;
    String nomCompletBienImmobilier;
    String nomBaptiserBienImmobilier;
    String description;
    double superficieBien;
    boolean bienMeublerResidence;
    boolean isOccupied= false;
    boolean isUnderBuildingMagasin;
    Long idEtage;
    Long idSite;
    Long idUtilisateur;
    String proprietaire;
    Long idmmeuble;
    Long idChapitre;
}
