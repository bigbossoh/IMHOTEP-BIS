package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;

import com.bzdata.gestimospringbackend.Models.hotel.CategorieChambre;

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
@DiscriminatorValue("Appartement")
public class Appartement extends Bienimmobilier {

    int nbrPieceApp;
    int nbreChambreApp;
    int nbreSalonApp;
    int nbreSalleEauApp;
    Long numApp;
    @ManyToOne(fetch = FetchType.LAZY)
    Etage etageAppartement;
    @ManyToOne
     CategorieChambre categorieChambreAppartement;
}
