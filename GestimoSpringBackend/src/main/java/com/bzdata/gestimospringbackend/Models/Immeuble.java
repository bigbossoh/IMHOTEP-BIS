package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.util.List;

import jakarta.persistence.*;

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
@DiscriminatorValue("Immeuble")
public class Immeuble extends AbstractEntity {

    String codeNomAbrvImmeuble;
    String nomCompletImmeuble;
    String nomBaptiserImmeuble;
    String descriptionImmeuble;
    int numImmeuble;
    int nbrEtage;
    int nbrePiecesDansImmeuble;
    boolean isGarrage;
    @OneToMany(mappedBy = "immeuble")
    List<Etage> etages;
    @ManyToOne(fetch = FetchType.LAZY)
    Site site;
    @ManyToOne
    Utilisateur utilisateurProprietaire;
}
