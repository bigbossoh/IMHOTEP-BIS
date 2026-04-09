package com.bzdata.gestimospringbackend.department.entity;

import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.SuivieDepense;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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

public class Chapitre  {
    @Id
    @GeneratedValue
    Long id;
    String libelleChapitre;
    @OneToMany(mappedBy = "chapitre")
    List<Bienimmobilier> biens;
     @OneToMany(mappedBy = "chapitreSuivis")
    List<SuivieDepense> suivisDepenseChapitre;
}
