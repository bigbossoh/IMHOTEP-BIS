package com.bzdata.gestimospringbackend.Models;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
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
@DiscriminatorValue("BailLocation")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BailLocation extends Operation {
    public static Object getUtilisateurOperation;
    String designationBail; 
    String abrvCodeBail;
    boolean enCoursBail;
    boolean archiveBail;
    double montantCautionBail;
    int nbreMoisCautionBail;
    LocalDate dateCloture;
    @OneToMany(orphanRemoval = true, cascade = CascadeType.PERSIST,mappedBy = "bailLocation")
    List<MontantLoyerBail> montantLoyerBail;
    @OneToMany(orphanRemoval = true, cascade = CascadeType.PERSIST,mappedBy = "bailLocataireCharge")
    List<Charges> charges;
    @OneToMany(orphanRemoval = true, cascade = CascadeType.PERSIST,mappedBy = "bailLocationAppelLoyer")
    List<AppelLoyer> listAppelsLoyers;
}
