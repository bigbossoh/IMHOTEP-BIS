package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppelLoyersFactureDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String periodeAppelLoyer;
    String statusAppelLoyer;
    LocalDate datePaiementPrevuAppelLoyer;
    LocalDate dateDebutMoisAppelLoyer;
    LocalDate dateFinMoisAppelLoyer;
    String periodeLettre;
    String moisUniquementLettre;
    int anneeAppelLoyer;
    int moisChiffreAppelLoyer;
    String descAppelLoyer;
    double montantLoyerBailLPeriode;
    double soldeAppelLoyer;
    boolean isSolderAppelLoyer;
    boolean isCloturer;
    boolean isUnLock;
    // Locataire
    String nomLocataire;
    String prenomLocataire;
    String genreLocataire;
    String emailLocatire;
    Long idLocataire;
    // Agence
    String nomAgence;
    String telAgence;
    String compteContribuableAgence;
    String emailAgence;
    String mobileAgence;
    String regimeFiscaleAgence;
    String faxAgence;
    String sigleAgence;
    // Bien Immobilier
    String bienImmobilierFullName;
    String abrvBienimmobilier;
    // Proprietaire
    String nomPropietaire;
    String prenomPropietaire;
    String genrePropietaire;
    String mailProprietaire;
    // BailLocation
    Long idBailLocation;
    String abrvCodeBail;
    double nouveauMontantLoyer;

    double ancienMontant;
    double pourcentageReduction;
    String messageReduction;

    String typePaiement;

}
