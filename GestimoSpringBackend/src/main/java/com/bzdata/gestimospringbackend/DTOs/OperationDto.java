package com.bzdata.gestimospringbackend.DTOs;

import java.time.Instant;
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
public class OperationDto {

    Long id;
    Long idAgence;
    Long idCreateur;
    Long idFirstAppel;
    
    Instant creationDate;
    Instant lastModifiedDate;
    LocalDate dateDebut;
    LocalDate dateFin;
    String utilisateurOperation;
    String bienImmobilierOperation;

    String designationBail;
    String abrvCodeBail;
    boolean enCoursBail;
    boolean archiveBail;
    double montantCautionBail;
    int nbreMoisCautionBail;
    double nouveauMontantLoyer;
    Long idBienImmobilier;
    long idLocataire;
    String codeAbrvBienImmobilier;

}
