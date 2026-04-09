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
public class LocataireEncaisDTO {
    Long id;
    Long idBien;
    Long idBail;
    Long idAppel;
    double montantloyer;
    String mois;
    String moisEnLettre;
    String nom;
    String prenom;
    String codeDescBail;
    String username;
    double soldeAppelLoyer;
    boolean isUnlock;
    boolean bailEnCours;
    String statutBail;
    LocalDate dateClotureBail;

}
