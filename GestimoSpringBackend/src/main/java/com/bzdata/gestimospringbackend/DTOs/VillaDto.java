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
public class VillaDto {
    Long id;
    Long idAgence;
    Long idCreateur;

    int nbrePieceVilla;
    int nbrChambreVilla;
    int nbrSalonVilla;
    int nbrSalleEauVilla;
    Long numVilla;

    String codeAbrvBienImmobilier;
    String nomCompletBienImmobilier;
    String nomBaptiserBienImmobilier;
    String description;
    double superficieBien;
    boolean bienMeublerResidence;
    boolean isOccupied= false;

    Long idSite;
    Long idUtilisateur;
    String proprietaire;
    Long idChapitre;
}
