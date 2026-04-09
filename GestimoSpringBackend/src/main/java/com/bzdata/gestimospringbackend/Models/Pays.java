package com.bzdata.gestimospringbackend.Models;

import java.util.List;

import jakarta.persistence.Entity;
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
public class Pays extends AbstractEntity {
    String abrvPays;
    String nomPays;
    @OneToMany(mappedBy = "pays")
    List<Ville>villes;
}
