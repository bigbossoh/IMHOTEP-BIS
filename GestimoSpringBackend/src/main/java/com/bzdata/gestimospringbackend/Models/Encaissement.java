package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.time.LocalDate;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "modePaiement", discriminatorType = DiscriminatorType.STRING)
public class Encaissement extends AbstractEntity {
    LocalDate dateEncaissement;
    double montantEncaissement;
    @ManyToOne
    Utilisateur utilisateurEncaissement;
    @ManyToOne
    AppelLoyer appelLoyerEncaissement;
}
