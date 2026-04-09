package com.bzdata.gestimospringbackend.Models;

import java.time.LocalDate;

import jakarta.persistence.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Quittance extends AbstractEntity {

    int anneeLoyer;
    double chargeLoyer;
    String codeBien;
    LocalDate datePaiement;
    boolean envoiParMail;
    boolean envoiParSms;
    Long idAppel;
    Long idEncaisseemnt;
    int moisLoyer;
    double montantPayer;
    String nomLocataire;
    String nomProprietaire;
    String observationQuittance;
    double soldeLoyer;
}
