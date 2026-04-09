package com.bzdata.gestimospringbackend.Models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Etage extends AbstractEntity {
    private String nomCompletEtage;
    private String codeAbrvEtage;
    private String nomBaptiserEtage;
    private int numEtage;
    private int nombrePieceSurEtage;
    @OneToMany(mappedBy = "etageAppartement")
    private List<Appartement> appartements;
//    @OneToMany(mappedBy = "etageStudio")
//    private List<Studio> studios;
    @OneToMany(mappedBy = "etageMagasin")
    private List<Magasin> magasins;
    @ManyToOne
    private Immeuble immeuble;


}
