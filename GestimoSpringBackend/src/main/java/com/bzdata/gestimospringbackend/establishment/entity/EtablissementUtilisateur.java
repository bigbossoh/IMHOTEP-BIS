package com.bzdata.gestimospringbackend.establishment.entity;

import com.bzdata.gestimospringbackend.Models.AbstractEntity;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
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
public class EtablissementUtilisateur extends AbstractEntity {

  boolean etableDefault;

  @ManyToOne
  Etablissement etabl;

  @ManyToOne
  Utilisateur utilisateurEtabl;
}
