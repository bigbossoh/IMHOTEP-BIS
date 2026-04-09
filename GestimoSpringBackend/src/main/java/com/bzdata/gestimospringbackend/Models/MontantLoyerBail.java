package com.bzdata.gestimospringbackend.Models;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MontantLoyerBail extends AbstractEntity {
    double ancienMontantLoyer;
    double nouveauMontantLoyer;
    LocalDate debutLoyer;
    LocalDate finLoyer;
    boolean statusLoyer;
    double tauxLoyer;
    double montantAugmentation;
    @ManyToOne
    BailLocation bailLocation;
 
}
