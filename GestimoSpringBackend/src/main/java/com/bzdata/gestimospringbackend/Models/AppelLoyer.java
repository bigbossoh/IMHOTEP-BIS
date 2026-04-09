package com.bzdata.gestimospringbackend.Models;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

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
public class AppelLoyer extends AbstractEntity {
    String periodeAppelLoyer;
    String periodeLettre;
    String statusAppelLoyer;
    LocalDate datePaiementPrevuAppelLoyer;
    LocalDate dateDebutMoisAppelLoyer;
    LocalDate dateFinMoisAppelLoyer;
    int anneeAppelLoyer;
    int moisChiffreAppelLoyer;
    String moisUniquementLettre;
    String descAppelLoyer;
    double montantLoyerBailLPeriode;
    double soldeAppelLoyer;
    boolean isSolderAppelLoyer;
    boolean isCloturer;
    boolean isUnLock=false;
    double ancienMontant;
    double pourcentageReduction;
    String messageReduction;
    String typePaiement;
    @ManyToOne
    BailLocation bailLocationAppelLoyer;
    @OneToMany(mappedBy = "appelLoyerEncaissement")
    List<Encaissement> encaissementsAppelLoyer;
}
