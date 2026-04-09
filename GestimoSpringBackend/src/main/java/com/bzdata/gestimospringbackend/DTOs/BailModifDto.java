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
public class BailModifDto {
    Long idBail;
    Long idAgence;
    int nombreMoisCaution;
    double nouveauMontantLoyer;
    double ancienMontantLoyer;
    LocalDate dateDePriseEncompte;
    LocalDate dateFin;
}
