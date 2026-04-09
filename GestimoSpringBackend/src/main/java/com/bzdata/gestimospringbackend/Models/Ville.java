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
public class Ville extends AbstractEntity {

    String abrvVille;
    String nomVille;
    @ManyToOne
    Pays pays;
    @OneToMany(mappedBy = "ville")
    List<Commune>communes;
}
